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

该命令验证文档、TypeScript、原文/claim/story/asset 链路并编译活动内容包。完整验证记录见 [验证报告](docs/verification-report.md)；常用命令还包括 `npm test`、`npm run build:all && npm run build:budget`、`npm run test:e2e`、`npm run deploy:dry` 和 `npm run content:intake -- <source.txt> <content-dir> <book-id>`。
