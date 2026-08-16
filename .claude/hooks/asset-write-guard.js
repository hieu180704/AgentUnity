#!/usr/bin/env node
/**
 * asset-write-guard.js — PreToolUse hook (write_to_file | replace_file_content | multi_replace_file_content)
 *
 * Chặn CỨNG việc sửa file asset Unity qua text tool (.prefab, .unity, .asset, .meta).
 * Lý do: Các file này là dữ liệu serialized do Unity Engine quản lý; sửa trực tiếp qua text
 * sẽ làm hỏng GUID/fileID, gây mất liên kết (broken references) im lặng trong Unity Editor.
 *
 * Cơ chế Antigravity:
 * - Nhận payload qua stdin (toolCall.name, toolCall.args.TargetFile).
 * - Nếu vi phạm -> xuất JSON qua stdout: { "decision": "deny", "reason": "..." }.
 * - Nếu an toàn -> xuất { "decision": "allow" } hoặc {}.
 * - Fail-safe: Mọi lỗi ngoại lệ đều fail-open (cho phép) để không làm tắc nghẽn session.
 *
 * Killswitch: GEMINI_HOOKS_DISABLE=1 hoặc ASSET_WRITE_GUARD_DISABLE=1
 */

'use strict';

const BLOCKED_EXTENSIONS = /\.(prefab|unity|asset|meta)$/i;

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(data));
  });
}

function allow() {
  process.stdout.write(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
}

function deny(reason) {
  process.stdout.write(JSON.stringify({
    decision: 'deny',
    reason: reason
  }));
  process.exit(0);
}

(async () => {
  if (process.env.GEMINI_HOOKS_DISABLE === '1' || process.env.ASSET_WRITE_GUARD_DISABLE === '1') {
    allow();
  }

  let raw = await readStdin();
  if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1); // Strip BOM nếu có
  }

  let data;
  try {
    data = JSON.parse(raw || '{}');
  } catch (_) {
    allow();
  }

  const toolCall = data.toolCall || {};
  const toolName = toolCall.name || '';
  const args = toolCall.args || {};

  // Kiểm tra target file path từ arguments của tool sửa file Antigravity
  const targetFile = args.TargetFile || args.filePath || args.file_path || '';

  if (targetFile && BLOCKED_EXTENSIONS.test(targetFile)) {
    const ext = (targetFile.match(BLOCKED_EXTENSIONS) || [])[1] || 'asset';
    const reason =
      `🛡️ [Asset Write Guard] CHẶN ghi file Unity Serialized (.${ext}): "${targetFile}".\n` +
      `File .prefab, .unity, .asset, .meta là định dạng YAML do Unity Engine quản lý trực tiếp.\n` +
      `Sửa qua text tool làm gãy GUID/fileID, gây mất reference runtime im lặng.\n` +
      `-> Hãy hướng dẫn dev thực hiện thay đổi này trong Unity Editor/Inspector hoặc dùng Unity MCP.\n` +
      `(Tắt guard tạm thời: đặt biến môi trường ASSET_WRITE_GUARD_DISABLE=1).`;
    deny(reason);
  }

  allow();
})();
