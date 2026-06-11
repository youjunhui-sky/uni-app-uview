---
name: git-commit-chinese
description: 执行项目约定：git add -A + 中文 commit + push。仅在用户明确说"提交"、"git提交"、"帮我提交"、"commit"、"push"等关键词时触发。绝不自动提交。
allowed-tools: [Bash(git add *), Bash(git commit *), Bash(git push *), Bash(git diff *), Bash(git status *), Bash(git log *)]
---

# git-commit-chinese

项目约定的三段式提交流程。

## 触发条件

**仅**在用户明确说以下关键词时执行：
- "提交" / "git提交" / "帮我提交" / "commit" / "push"
- 任何包含"提一下"、"commit 一下"的变体

**绝不**在用户没要求时自动执行（避免无意义的提交）。

## 步骤

1. `git add -A` 暂存所有变更
2. `git commit -m "<根据 git diff 内容自动生成的中文 commit message>"`
3. `git push` 推送到 origin/main
4. 如果 push 被 secret scanning 拒绝 → 自动修复后重新 push（不引入新功能）

## commit message 规范

- **中文**
- 格式: `<type>: <简短描述>`
- `type` 限定: `fix` / `refactor` / `chore` / `feat` / `docs` / `style` / `test` / `perf`
- 复杂变更可加空行 + 多行 body
- 末尾加 `Co-Authored-By: Claude <noreply@anthropic.com>`

示例:
```
fix: 上传头像 avatarUrl 渲染为 [object Object]

- useUpload.ts: 本地分支取 data.url 字符串
- 修 set.vue/login.vue 头像存为对象的问题

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 失败处理

| 情况 | 行为 |
|------|------|
| 工作树无变更 | 提示用户"无变更可提交"，不执行 commit |
| push 被 secret scanning 拒绝 | 自动修复后重推（不引入新功能） |
| pre-commit hook 失败 | 报告并停下，**不**自动 `--no-verify` |
| commitlint 检查失败 | 同上，停下让用户看 |
