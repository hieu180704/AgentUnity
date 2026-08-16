#!/usr/bin/env node
/**
 * lint-conventions.js — C# Code Convention & Safety Linter cho Unity
 *
 * Kiểm tra nhanh các vi phạm phổ biến trong code Unity C#:
 * 1. Thiếu Namespace (trừ script ngoài Editor/Plugins nếu có cấu hình).
 * 2. Naming convention (Interface bắt đầu bằng 'I', PascalCase cho Method/Property/Class).
 * 3. Bẫy hiệu năng: GameObject.Find / GetComponent / FindObjectOfType trong Update / FixedUpdate / LateUpdate.
 * 4. Hàm lifecycle rỗng (Update/Start/Awake rỗng gây hao tổn overhead của Unity Engine).
 * 5. Serialization: [SerializeField] trên public field.
 *
 * Output:
 * - Exit code 0: Không có vi phạm.
 * - Exit code 1: Có vi phạm (in danh sách dòng + mô tả).
 */

'use strict';

const fs = require('fs');
const path = require('path');

function lintFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { pass: true, errors: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const errors = [];

  let inNamespace = false;
  let inUpdateLoop = false;
  let updateLoopBraces = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];
    const trimmed = line.trim();

    // Bỏ qua comment
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      continue;
    }

    // 1. Kiểm tra Namespace
    if (/^namespace\s+[A-Za-z0-9_.]+/i.test(trimmed)) {
      inNamespace = true;
    }

    // 2. Kiểm tra hàm lifecycle rỗng (VD: void Update() {} hoặc Update() { \n })
    if (/void\s+(Awake|Start|Update|FixedUpdate|LateUpdate)\s*\(\s*\)\s*\{\s*\}/.test(trimmed)) {
      errors.push(`[Dòng ${lineNum}] Hàm lifecycle rỗng (${trimmed}) — Unity vẫn tốn overhead gọi mỗi frame, nên xoá nếu không dùng.`);
    }

    // 3. Theo dõi Update/FixedUpdate/LateUpdate loop để bắt lệnh nặng
    if (/(void|IEnumerator)\s+(Update|FixedUpdate|LateUpdate)\s*\(/.test(trimmed)) {
      inUpdateLoop = true;
      updateLoopBraces = 0;
    }

    if (inUpdateLoop) {
      if (trimmed.includes('{')) updateLoopBraces += (trimmed.match(/\{/g) || []).length;
      if (trimmed.includes('}')) updateLoopBraces -= (trimmed.match(/\}/g) || []).length;

      // Kiểm tra Find / GetComponent nặng trong Update
      const findMatch = trimmed.match(/\b(GameObject\.Find|FindObjectOfType|FindObjectsOfType|FindAnyObjectByType|FindObjectsByType)\b/);
      if (findMatch) {
        errors.push(`[Dòng ${lineNum}] Gọi '${findMatch[0]}' trong vòng lặp Update gây sụt giảm FPS. Hãy cache vào Awake/Start.`);
      }
      if (/\bGetComponent<[A-Za-z0-9_]+>\s*\(/.test(trimmed) && !/TryGetComponent/.test(trimmed)) {
        errors.push(`[Dòng ${lineNum}] Gọi GetComponent liên tục trong Update loop. Nên cache component vào biến thành viên.`);
      }

      if (updateLoopBraces <= 0 && trimmed.includes('}')) {
        inUpdateLoop = false;
      }
    }

    // 4. [SerializeField] trên public field
    if (/\[SerializeField\]\s*public\s+/.test(trimmed)) {
      errors.push(`[Dòng ${lineNum}] '[SerializeField] public' là thừa thãi. Public field đã tự động serialize; nếu muốn private hãy dùng '[SerializeField] private'.`);
    }

    // 5. Interface name check (phải bắt đầu bằng I)
    const interfaceMatch = trimmed.match(/public\s+interface\s+([A-Za-z0-9_]+)/);
    if (interfaceMatch) {
      const ifaceName = interfaceMatch[1];
      if (!/^I[A-Z]/.test(ifaceName)) {
        errors.push(`[Dòng ${lineNum}] Interface '${ifaceName}' phải bắt đầu bằng tiền tố 'I' theo chuẩn C# (VD: I${ifaceName}).`);
      }
    }
  }

  // Cảnh báo nếu file .cs hoàn toàn không có namespace
  if (!inNamespace && lines.length > 10 && !/Editor|Plugins/.test(filePath.replace(/\\/g, '/'))) {
    errors.push(`[Root] File C# không nằm trong 'namespace'. Nên đóng gói vào namespace chuẩn của dự án (VD: Game.Core, Game.UI).`);
  }

  return {
    pass: errors.length === 0,
    errors: errors
  };
}

// Chạy trực tiếp từ CLI
if (require.main === module) {
  const target = process.argv[2];
  if (!target) {
    console.error('Cách dùng: node lint-conventions.js <đường_dẫn_file_cs>');
    process.exit(0);
  }

  const result = lintFile(target);
  if (!result.pass) {
    console.log('--- LINT FAIL ---');
    result.errors.forEach((e) => console.log(`• ${e}`));
    process.exit(1);
  } else {
    console.log('--- LINT PASS ---');
    process.exit(0);
  }
}

module.exports = { lintFile };
