# 古籍活化引擎验证报告

验证对象：`content/demo`（《史记·留侯世家·圯上受履：五日之约》）

## 自动化结果

- `npm run playability:gate`：通过。它依次执行内容规格/全分支/正史路线/内容编译、文档与 TypeScript、回归、生产构建、体积预算、浏览器试玩与部署 dry-run。
- 门禁报告：`reports/demo/quality-gate.json`、`reports/demo/completion.json`；内容报告：`reports/demo/content-report.json`。
- `npm test`：通过（故障 fixture、source importer、版本化存档、Ink 全分支、正史路线，以及章节质量规格未达标时的阻断）。
- 第二个前向测试章节 `content/zuozhuan-zhuzhiwu`：通过内容质量门禁。它来自《左传·僖公三十年》的“烛之武退秦师”切片，含 10 段原文、12 条 claim、7 个正史抉择和 4 条明确标记的反事实线。
- 前向测试曾发现浏览器脚本硬编码“圯上受履”的标题、选项与文案；现已改为从 `generated/active` 自动读取正史、反事实、成就与来源，不再依赖 demo 专名。
- `quick_validate.py skills/build-classics-alive-game`：通过。
- `git diff --check`：通过。

## 浏览器冒烟

- Web：7 个正史选择均可抵达“正史结局”，4 个假设分支均明确显示为非原典路径。
- 重试：失败结局可回到上一个抉择；版本不一致的存档被拒绝。
- 窄屏：390×844 下无水平溢出；键盘 Enter 可触发已聚焦选择。
- Studio：审校台展示编译内容包中的所有 claims、来源、usage 与人工审校状态。

## 当前发布状态

内容已达到 `validated / awaiting-human-review`。历史底本与异文仍待史学顾问确认，SVG 资产为项目自制草图，真实 Cloudflare 预览尚未部署；因此不宣称已发布成品。
