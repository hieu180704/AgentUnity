#!/usr/bin/env node
/**
 * convention-lint-guard.js — PostToolUse hook (write_to_file | replace_file_content | multi_replace_file_content)
 *
 * Tự động chạy linter C# sau khi AI ghi/sửa file .cs.
 * Nếu phát hiện vi phạm convention hoặc bẫy hiệu năng, script sẽ thông báo ngay để AI/Dev
 * nhận biết và khắc phục kịp thời.
 *
 * Killswitch: GEMINI_HOOKS_DISABLE=1 hoặc CONVENTION_LINT_DISABLE=1
 */

'use strict';

const path = require('path');
const { lintFile } = require('./scripts/lint-conventions');

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(data));
  });
}

(async () => {
  if (process.env.GEMINI_HOOKS_DISABLE === '1' || process.env.CONVENTION_LINT_DISABLE === '1') {
    process.stdout.write('{}');
    process.exit(0);
  }

  let raw = await readStdin();
  if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
  }

  let data;
  try {
    data = JSON.parse(raw || '{}');
  } catch (_) {
    process.stdout.write('{}');
    process.exit(0);
  }

  const toolCall = data.toolCall || {};
  const args = toolCall.args || {};
  const targetFile = args.TargetFile || args.filePath || args.file_path || '';

  if (targetFile && targetFile.endsWith('.cs')) {
    const result = lintFile(targetFile);
    if (!result.pass) {
      const fileName = path.basename(targetFile);
      console.warn(`\n⚠️ [Convention Lint Nhắc nhở] Phát hiện ${result.errors.length} điểm cần lưu ý trong '${fileName}':`);
      result.errors.slice(0, 10).forEach((err) => console.warn(`   • ${err}`));
      if (result.errors.length > 10) {
        console.warn(`   ... (và ${result.errors.length - 10} cảnh báo khác)`);
      }
    }
  }

  process.stdout.write('{}');
  process.exit(0);
})();
