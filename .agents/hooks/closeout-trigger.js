#!/usr/bin/env node
/**
 * closeout-trigger.js — PreToolUse hook (run_command)
 *
 * Tự động nhắc nhở AI tạo Worklog Fragment (Docs/Done/<date>__<slug>.txt) khi thực hiện `git commit`.
 * Mục đích: Duy trì lịch sử công việc và thông tin bàn giao giữa các phiên làm việc (Handoff)
 * mà không phụ thuộc vào trí nhớ của AI/Dev.
 *
 * Tiêu chí an toàn:
 * - Fail-safe: Luôn cho phép commit (decision: "allow"), không bao giờ chặn git commit.
 * - Anti-spam: Chỉ nhắc 1 lần mỗi phiên làm việc.
 * - Killswitch: GEMINI_HOOKS_DISABLE=1 hoặc CLOSEOUT_TRIGGER_DISABLE=1
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const STATE_DIR = path.join(os.tmpdir(), 'gemini-closeout-trigger');

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

function alreadyWarned(conversationId) {
  try {
    const markerFile = path.join(STATE_DIR, sanitize(conversationId) + '.json');
    if (fs.existsSync(markerFile)) {
      return true;
    }
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(markerFile, JSON.stringify({ warned: true, timestamp: Date.now() }));
    return false;
  } catch (_) {
    return false;
  }
}

function allow(reason) {
  const res = { decision: 'allow' };
  if (reason) res.reason = reason;
  process.stdout.write(JSON.stringify(res));
  process.exit(0);
}

(async () => {
  if (process.env.GEMINI_HOOKS_DISABLE === '1' || process.env.CLOSEOUT_TRIGGER_DISABLE === '1') {
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
  if (toolCall.name !== 'run_command') {
    allow();
  }

  const cmd = (toolCall.args && toolCall.args.CommandLine) || '';
  if (!/\bgit\s+commit\b/i.test(cmd)) {
    allow(); // Không phải lệnh git commit -> Cho phép
  }

  const conversationId = data.conversationId || 'default';
  if (alreadyWarned(conversationId)) {
    allow(); // Đã nhắc trong phiên này -> Không spam
  }

  // Kiểm tra git status xem có thay đổi trong Docs/Done/ chưa
  try {
    const statusOut = execSync('git status --porcelain', { encoding: 'utf8', timeout: 3000 });
    if (!statusOut || statusOut.trim().length === 0) {
      allow();
    }

    const hasDoneFragment = /Docs\/Done\/.+\.(txt|md)/i.test(statusOut);
    if (!hasDoneFragment) {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const warning =
        `📋 [Closeout Nudge Nhắc nhở]: Bạn đang chuẩn bị commit mà chưa tạo Worklog Fragment trong Docs/Done/.\n` +
        `Nếu phiên làm việc này vừa hoàn thành một tính năng/fix lỗi quan trọng, hãy tạo file:\n` +
        `  -> 'Docs/Done/${today}__<ten-task>.txt' (Gồm tóm tắt việc đã làm & lưu ý bàn giao)\n` +
        `để duy trì tài liệu sống (Living Docs) trước khi kết thúc phiên. (Commit vẫn được tiếp tục bình thường).`;
      allow(warning);
    }
  } catch (_) {
    allow();
  }

  allow();
})();
