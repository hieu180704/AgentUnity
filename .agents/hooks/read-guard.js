#!/usr/bin/env node
/**
 * read-guard.js — PreToolUse hook (view_file)
 *
 * Nhắc nhở kỷ luật đọc file có mục tiêu (Targeted Reads):
 * Khi đọc file lớn (>300 dòng hoặc >150 dòng có Mục lục) mà không chỉ định StartLine/EndLine,
 * hook sẽ ghi nhận và nhắc nhở để giữ Context Window luôn gọn nhẹ và tiết kiệm token.
 *
 * Tiêu chí an toàn:
 * - Fail-safe: Luôn cho phép (decision: "allow"), không bao giờ chặn luồng đọc của dev/AI.
 * - Killswitch: GEMINI_HOOKS_DISABLE=1 hoặc READ_GUARD_DISABLE=1
 */

'use strict';

const fs = require('fs');

const CONFIG = {
  bigFileLines: Number(process.env.READ_GUARD_LINES) || 300,
  tocScanLines: 30,
  tocPatterns: [
    /^#{1,3}\s*table\s+of\s+contents/i,
    /^#{1,3}\s*contents\b/i,
    /^#{1,3}\s*m[uụ]c\s*l[uụ]c/i,
    /^#{1,3}\s*toc\b/i,
  ],
};

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(data));
  });
}

function allow(reason) {
  const res = { decision: 'allow' };
  if (reason) res.reason = reason;
  process.stdout.write(JSON.stringify(res));
  process.exit(0);
}

(async () => {
  if (process.env.GEMINI_HOOKS_DISABLE === '1' || process.env.READ_GUARD_DISABLE === '1') {
    allow();
  }

  let raw = await readStdin();
  if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
  }

  let data;
  try {
    data = JSON.parse(raw || '{}');
  } catch (_) {
    allow();
  }

  const toolCall = data.toolCall || {};
  if (toolCall.name !== 'view_file') {
    allow();
  }

  const args = toolCall.args || {};
  const filePath = args.AbsolutePath || args.filePath || '';

  // Đã có chỉ định dòng (Targeted Read) -> Cho phép ngay
  if (args.StartLine != null || args.EndLine != null) {
    allow();
  }

  if (!filePath || typeof filePath !== 'string') {
    allow();
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    allow(); // Không đọc được file thì để tool tự xử lý lỗi
  }

  const lines = content.split(/\r?\n/);
  const flags = [];

  if (lines.length > CONFIG.bigFileLines) {
    flags.push(`${lines.length} dòng`);
  }

  const head = lines.slice(0, CONFIG.tocScanLines);
  if (lines.length > CONFIG.bigFileLines / 2 &&
      head.some((l) => CONFIG.tocPatterns.some((re) => re.test(l)))) {
    flags.push('có mục lục');
  }

  if (flags.length === 0) {
    allow(); // File ngắn và không có TOC -> Đọc full hợp lý
  }

  const base = filePath.split(/[\\/]/).pop();
  const warning =
    `💡 [Read Guard Nhắc nhở]: '${base}' (${flags.join(', ')}) là file lớn/có mục lục.\n` +
    `Khuyến nghị: Đọc 30-50 dòng đầu để xem mục lục, sau đó dùng StartLine & EndLine đọc đúng section cần thiết để tiết kiệm token context.`;

  allow(warning);
})();
