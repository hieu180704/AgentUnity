#!/usr/bin/env node
/**
 * ==============================================================================
 * Universal Tri-Agent Sync Tool (Gemini, Claude & ChatGPT / OpenAI)
 * Tự động đồng bộ 3 chiều giữa .agents/ (Gemini), .claude/ (Claude) và .openai/ (ChatGPT)
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const agentsDir = path.join(rootDir, '.agents');
const claudeDir = path.join(rootDir, '.claude');
const openaiDir = path.join(rootDir, '.openai');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function transformToClaude(content) {
  return content
    .replace(/GeminiUnity/g, 'AgentUnity')
    .replace(/geminiunity/g, 'agentunity')
    .replace(/ClaudeUnity/g, 'AgentUnity')
    .replace(/claudeunity/g, 'agentunity')
    .replace(/\.agents\/rules\//g, '.claude/rules/')
    .replace(/\.agents\/recipes\//g, '.claude/recipes/')
    .replace(/\.agents\/skills\//g, '.claude/commands/')
    .replace(/\.agents\/hooks\//g, '.claude/hooks/')
    .replace(/\.openai\/rules\//g, '.claude/rules/')
    .replace(/\.openai\/recipes\//g, '.claude/recipes/')
    .replace(/\.agents\/AGENTS\.md/g, 'CLAUDE.md')
    .replace(/CHATGPT\.md/g, 'CLAUDE.md')
    .replace(/\.agents\//g, '.claude/')
    .replace(/\.openai\//g, '.claude/')
    .replace(/AGENTS\.md/g, 'CLAUDE.md')
    .replace(/CHATGPT_TEMPLATE\.md/g, 'CLAUDE_TEMPLATE.md')
    .replace(/AGENTS_TEMPLATE\.md/g, 'CLAUDE_TEMPLATE.md')
    .replace(/Gemini AI/g, 'Claude AI')
    .replace(/Gemini/g, 'Claude Code')
    .replace(/ChatGPT/g, 'Claude Code');
}

function transformToGemini(content) {
  return content
    .replace(/ClaudeUnity/g, 'AgentUnity')
    .replace(/claudeunity/g, 'agentunity')
    .replace(/\.claude\/rules\//g, '.agents/rules/')
    .replace(/\.claude\/recipes\//g, '.agents/recipes/')
    .replace(/\.claude\/commands\//g, '.agents/skills/')
    .replace(/\.claude\/hooks\//g, '.agents/hooks/')
    .replace(/\.openai\/rules\//g, '.agents/rules/')
    .replace(/\.openai\/recipes\//g, '.agents/recipes/')
    .replace(/CLAUDE\.md/g, '.agents/AGENTS.md')
    .replace(/CHATGPT\.md/g, '.agents/AGENTS.md')
    .replace(/\.claude\//g, '.agents/')
    .replace(/\.openai\//g, '.agents/')
    .replace(/CLAUDE_TEMPLATE\.md/g, '.agents/AGENTS_TEMPLATE.md')
    .replace(/CHATGPT_TEMPLATE\.md/g, '.agents/AGENTS_TEMPLATE.md')
    .replace(/Claude AI/g, 'Gemini AI')
    .replace(/Claude Code/g, 'Gemini')
    .replace(/ChatGPT/g, 'Gemini');
}

function transformToOpenAI(content) {
  return content
    .replace(/GeminiUnity/g, 'AgentUnity')
    .replace(/ClaudeUnity/g, 'AgentUnity')
    .replace(/\.agents\/rules\//g, '.openai/rules/')
    .replace(/\.agents\/recipes\//g, '.openai/recipes/')
    .replace(/\.claude\/rules\//g, '.openai/rules/')
    .replace(/\.claude\/recipes\//g, '.openai/recipes/')
    .replace(/\.agents\/skills\//g, '.openai/prompts/')
    .replace(/\.claude\/commands\//g, '.openai/prompts/')
    .replace(/\.agents\/AGENTS\.md/g, 'CHATGPT.md')
    .replace(/CLAUDE\.md/g, 'CHATGPT.md')
    .replace(/\.agents\//g, '.openai/')
    .replace(/\.claude\//g, '.openai/')
    .replace(/AGENTS_TEMPLATE\.md/g, 'CHATGPT_TEMPLATE.md')
    .replace(/CLAUDE_TEMPLATE\.md/g, 'CHATGPT_TEMPLATE.md')
    .replace(/Gemini/g, 'ChatGPT')
    .replace(/Claude Code/g, 'ChatGPT');
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
console.log('🔄 Universal Tri-Agent Sync Tool: Gemini <--> Claude <--> ChatGPT');
console.log('============================================================');

let totalChanges = 0;

// 1. Đồng bộ Rules giữa các Agent
console.log('\n[1/3] 📋 Đồng bộ Rules (.agents/rules <-> .claude/rules <-> .openai/rules)...');
if (fs.existsSync(path.join(agentsDir, 'rules'))) {
  totalChanges += syncDirectory(
    path.join(agentsDir, 'rules'),
    path.join(claudeDir, 'rules'),
    transformToClaude,
    'Gemini -> Claude Rules'
  );
  totalChanges += syncDirectory(
    path.join(agentsDir, 'rules'),
    path.join(openaiDir, 'rules'),
    transformToOpenAI,
    'Gemini -> OpenAI Rules'
  );
}
if (fs.existsSync(path.join(claudeDir, 'rules'))) {
  totalChanges += syncDirectory(
    path.join(claudeDir, 'rules'),
    path.join(agentsDir, 'rules'),
    transformToGemini,
    'Claude -> Gemini Rules'
  );
  totalChanges += syncDirectory(
    path.join(claudeDir, 'rules'),
    path.join(openaiDir, 'rules'),
    transformToOpenAI,
    'Claude -> OpenAI Rules'
  );
}

// 2. Đồng bộ Recipes giữa các Agent
console.log('\n[2/3] 📐 Đồng bộ Recipes (.agents/recipes <-> .claude/recipes <-> .openai/recipes)...');
if (fs.existsSync(path.join(agentsDir, 'recipes'))) {
  totalChanges += syncDirectory(
    path.join(agentsDir, 'recipes'),
    path.join(claudeDir, 'recipes'),
    transformToClaude,
    'Gemini -> Claude Recipes'
  );
  totalChanges += syncDirectory(
    path.join(agentsDir, 'recipes'),
    path.join(openaiDir, 'recipes'),
    transformToOpenAI,
    'Gemini -> OpenAI Recipes'
  );
}
if (fs.existsSync(path.join(claudeDir, 'recipes'))) {
  totalChanges += syncDirectory(
    path.join(claudeDir, 'recipes'),
    path.join(agentsDir, 'recipes'),
    transformToGemini,
    'Claude -> Gemini Recipes'
  );
  totalChanges += syncDirectory(
    path.join(claudeDir, 'recipes'),
    path.join(openaiDir, 'recipes'),
    transformToOpenAI,
    'Claude -> OpenAI Recipes'
  );
}

// 3. Đồng bộ Hook Scripts giữa Gemini và Claude
console.log('\n[3/3] 🛡️ Đồng bộ Hook Scripts (.agents/hooks <-> .claude/hooks)...');
if (fs.existsSync(path.join(agentsDir, 'hooks'))) {
  totalChanges += syncDirectory(
    path.join(agentsDir, 'hooks'),
    path.join(claudeDir, 'hooks'),
    transformToClaude,
    'Gemini -> Claude Hooks'
  );
}
if (fs.existsSync(path.join(claudeDir, 'hooks'))) {
  totalChanges += syncDirectory(
    path.join(claudeDir, 'hooks'),
    path.join(agentsDir, 'hooks'),
    transformToGemini,
    'Claude -> Gemini Hooks'
  );
}

console.log('\n============================================================');
if (totalChanges > 0) {
  console.log(`✅ Đồng bộ hoàn tất: ${totalChanges} files đã được cập nhật đồng nhất trên cả 3 Agent!`);
} else {
  console.log('✅ Hệ thống đã hoàn toàn đồng nhất trên cả 3 Agent. Không có thay đổi nào cần đồng bộ.');
}
console.log('============================================================\n');
