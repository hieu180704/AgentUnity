#!/usr/bin/env node
/**
 * ==============================================================================
 * Universal Dual-Agent Sync Tool (Gemini & Claude)
 * Tự động đồng bộ 2 chiều giữa .agents/ (Gemini/Antigravity) và .claude/ (Claude Code)
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const agentsDir = path.join(rootDir, '.agents');
const claudeDir = path.join(rootDir, '.claude');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function transformToClaude(content) {
  return content
    .replace(/GeminiUnity/g, 'ClaudeUnity')
    .replace(/geminiunity/g, 'claudeunity')
    .replace(/\.agents\/rules\//g, '.claude/rules/')
    .replace(/\.agents\/recipes\//g, '.claude/recipes/')
    .replace(/\.agents\/skills\//g, '.claude/commands/')
    .replace(/\.agents\/hooks\//g, '.claude/hooks/')
    .replace(/\.agents\/AGENTS\.md/g, 'CLAUDE.md')
    .replace(/\.agents\//g, '.claude/')
    .replace(/AGENTS\.md/g, 'CLAUDE.md')
    .replace(/AGENTS_TEMPLATE\.md/g, 'CLAUDE_TEMPLATE.md')
    .replace(/Gemini AI/g, 'Claude AI')
    .replace(/Gemini/g, 'Claude Code');
}

function transformToGemini(content) {
  return content
    .replace(/ClaudeUnity/g, 'GeminiUnity')
    .replace(/claudeunity/g, 'geminiunity')
    .replace(/\.claude\/rules\//g, '.agents/rules/')
    .replace(/\.claude\/recipes\//g, '.agents/recipes/')
    .replace(/\.claude\/commands\//g, '.agents/skills/')
    .replace(/\.claude\/hooks\//g, '.agents/hooks/')
    .replace(/CLAUDE\.md/g, '.agents/AGENTS.md')
    .replace(/\.claude\//g, '.agents/')
    .replace(/CLAUDE_TEMPLATE\.md/g, '.agents/AGENTS_TEMPLATE.md')
    .replace(/Claude AI/g, 'Gemini AI')
    .replace(/Claude Code/g, 'Gemini');
}

function syncDirectory(srcFolder, dstFolder, transformFn, label) {
  if (!fs.existsSync(srcFolder)) return 0;
  ensureDir(dstFolder);
  let count = 0;

  const items = fs.readdirSync(srcFolder);
  for (const item of items) {
    const srcPath = path.join(srcFolder, item);
    const dstPath = path.join(dstFolder, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      count += syncDirectory(srcPath, dstPath, transformFn, label);
    } else {
      let srcContent = fs.readFileSync(srcPath, 'utf8');
      let transformed = transformFn ? transformFn(srcContent) : srcContent;

      let shouldWrite = false;
      if (!fs.existsSync(dstPath)) {
        shouldWrite = true;
      } else {
        const dstContent = fs.readFileSync(dstPath, 'utf8');
        if (transformed.trim() !== dstContent.trim()) {
          const srcTime = stat.mtimeMs;
          const dstTime = fs.statSync(dstPath).mtimeMs;
          if (srcTime > dstTime) {
            shouldWrite = true;
          }
        }
      }

      if (shouldWrite) {
        fs.writeFileSync(dstPath, transformed.trim() + '\n', 'utf8');
        console.log(`  [${label}] -> ${path.relative(rootDir, dstPath)}`);
        count++;
      }
    }
  }
  return count;
}

console.log('============================================================');
console.log('🔄 Universal Dual-Agent Sync Tool: Gemini <--> Claude');
console.log('============================================================');

let totalChanges = 0;

if (fs.existsSync(agentsDir) && fs.existsSync(claudeDir)) {
  // Sync Rules
  console.log('\n[1/3] 📋 Đồng bộ Rules (.agents/rules <-> .claude/rules)...');
  totalChanges += syncDirectory(
    path.join(agentsDir, 'rules'),
    path.join(claudeDir, 'rules'),
    transformToClaude,
    'Gemini -> Claude'
  );
  totalChanges += syncDirectory(
    path.join(claudeDir, 'rules'),
    path.join(agentsDir, 'rules'),
    transformToGemini,
    'Claude -> Gemini'
  );

  // Sync Recipes
  console.log('\n[2/3] 📐 Đồng bộ Recipes (.agents/recipes <-> .claude/recipes)...');
  totalChanges += syncDirectory(
    path.join(agentsDir, 'recipes'),
    path.join(claudeDir, 'recipes'),
    transformToClaude,
    'Gemini -> Claude'
  );
  totalChanges += syncDirectory(
    path.join(claudeDir, 'recipes'),
    path.join(agentsDir, 'recipes'),
    transformToGemini,
    'Claude -> Gemini'
  );

  // Sync Hooks scripts
  console.log('\n[3/3] 🛡️ Đồng bộ Hook Scripts (.agents/hooks <-> .claude/hooks)...');
  totalChanges += syncDirectory(
    path.join(agentsDir, 'hooks'),
    path.join(claudeDir, 'hooks'),
    transformToClaude,
    'Gemini -> Claude'
  );
  totalChanges += syncDirectory(
    path.join(claudeDir, 'hooks'),
    path.join(agentsDir, 'hooks'),
    transformToGemini,
    'Claude -> Gemini'
  );
} else {
  console.log('ℹ️ Dự án đang ở chế độ Single-Agent (Chỉ có .agents hoặc .claude).');
}

console.log('\n============================================================');
if (totalChanges > 0) {
  console.log(`✅ Đồng bộ hoàn tất: ${totalChanges} files đã được cập nhật đồng nhất!`);
} else {
  console.log('✅ Hệ thống đã hoàn toàn đồng nhất. Không có thay đổi nào cần đồng bộ.');
}
console.log('============================================================\n');
