#!/usr/bin/env node
/**
 * unity-safety-inject.js — PreInvocation hook
 *
 * Tiêm các lưu ý an toàn tối quan trọng (8 bẫy ngầm) khi thao tác với Unity Engine & Unity MCP.
 * Kích hoạt 1 lần duy nhất mỗi phiên chat (once-per-conversation) để không làm phình context.
 *
 * Killswitch: GEMINI_HOOKS_DISABLE=1 hoặc UNITY_SAFETY_INJECT_DISABLE=1
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const STATE_DIR = path.join(os.tmpdir(), 'gemini-unity-safety-inject');

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(data));
  });
}

function sanitize(id) {
  return String(id || 'default_session').replace(/[^A-Za-z0-9_.-]/g, '_');
}

function alreadyInjected(conversationId) {
  try {
    const markerFile = path.join(STATE_DIR, sanitize(conversationId) + '.json');
    if (fs.existsSync(markerFile)) {
      return true;
    }
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(markerFile, JSON.stringify({ injected: true, timestamp: Date.now() }));
    return false;
  } catch (_) {
    return false;
  }
}

function finish(injectSteps = []) {
  process.stdout.write(JSON.stringify({ injectSteps }));
  process.exit(0);
}

(async () => {
  if (process.env.GEMINI_HOOKS_DISABLE === '1' || process.env.UNITY_SAFETY_INJECT_DISABLE === '1') {
    finish([]);
  }

  let raw = await readStdin();
  if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
  }

  let data;
  try {
    data = JSON.parse(raw || '{}');
  } catch (_) {
    finish([]);
  }

  const conversationId = data.conversationId || 'default';
  if (alreadyInjected(conversationId)) {
    finish([]); // Đã inject cho phiên này -> im lặng
  }

  const safetyMessage =
    `🛡️ [UNITY SAFETY & MCP GUARDRAILS]\n` +
    `8 bẫy ngầm khi tương tác với Unity Editor (Compile không bắt được, vỡ lúc Runtime):\n` +
    `1. Tên Property UI: Graphic/Image/Button nhận tên Serialized ('m_Color', 'm_Sprite'); RectTransform nhận tên API ('sizeDelta', 'anchoredPosition').\n` +
    `2. UI Object rỗng không tự thêm RectTransform -> Cần add tay hoặc tạo kèm một Image component.\n` +
    `3. Wire Reference qua SerializedObject: Luôn đọc ngược lại (read-back verify) để chắc chắn giá trị đã được ghi thành công.\n` +
    `4. Kiểm tra GUID script: Dùng AssetDatabase.GUIDToAssetPath, KHÔNG grep .meta trong Assets/ vì script package nằm tại Packages/.\n` +
    `5. Save Asset: Hạn chế SaveAssets toàn bộ; chỉ lưu đúng asset vừa chỉnh sửa (SaveAssetIfDirty).\n` +
    `6. Xử lý Timeout/Lỗi MCP: Timeout không đồng nghĩa lệnh ghi thất bại; phải verify git diff/state trước khi thử lại (tránh append trùng list/data).\n` +
    `7. Git Revert / Checkout Asset: Revert file không tự flush RAM của Unity Editor; cần gọi Refresh / ImportAsset để đồng bộ bộ nhớ.\n` +
    `8. Script Execution: Snippet chạy như method-body; không đặt 'using' ở đầu, dùng fully-qualified name (VD: System.Collections.Generic.List).\n` +
    `+ Data-Entry: Khi thêm entry vào Catalog/Config/SO, luôn assert không có item hỏng (consumer thường thiếu null-check trên luồng Init).\n` +
    `+ Zero-Override UI: Sửa prefab trong Prefab Mode rồi mới instantiate; tránh override property trực tiếp lên scene instance.`;

  finish([
    {
      ephemeralMessage: safetyMessage
    }
  ]);
})();
