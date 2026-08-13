# 古籍活化游戏引擎

> 将古籍原文、注释、人物、事件与文化意象，转化为可交互、可游玩、可追溯的 Web 游戏。

本仓库是独立的新项目，不复制 `timeslip-shiji` 的业务数据或应用结构。它以“可验证的内容生产线”为核心：古籍是证据源，内容包是长期资产，Web VN 是第一种交付形态。

## 文档

- [技术方案](docs/technical-plan.md)：架构、内容协议、运行时、质量闸门与部署策略。
- [开发计划](docs/development-plan.md)：阶段目标、验收标准、里程碑与开发顺序。
- [Agent 协作约束](AGENTS.md)：适用于 Codex、Claude、Trae 等 Agent 的项目规则。

## 当前状态

当前为 **v0.2 可玩章节 MVP**：输入导入、内容编译、证据校验、Ink 运行时、版本化本地存档、Web VN、审校台与 CI 浏览器门禁均已实现。`content/demo` 是《史记·留侯世家·圯上受履》的 12 分钟垂直切片（7 个正史抉择、4 个假设结局）；其自动化状态为 `validated`，史学与正式美术仍处于 `awaiting-human-review / draft`，不得宣称为已发布成品。

```bash
npm run check
```

`npm run check` 适合日常快速检查。交付或让 Agent 宣称“完整可玩”前，必须运行：

```bash
npm run playability:gate
```

它会把内容规格、所有分支、正史路线、回归测试、生产构建、体积预算、浏览器试玩和部署 dry-run 串成单一门禁；结论写入 `reports/<pack-id>/completion.json`。技术通过只得到 `validated`，仍需在内容包的 `review/approval.json` 中记录真人史学审校，才会成为 `ready-for-release`。完整验证记录见 [验证报告](docs/verification-report.md)；导入命令为 `npm run content:intake -- <source.txt> <content-dir> <book-id>`。

要在不改写默认活动包的情况下验证另一章，可显式指定：

```bash
CAGE_CONTENT_PACK=content/demo CAGE_STORY_ID=demo npm run playability:gate
```
