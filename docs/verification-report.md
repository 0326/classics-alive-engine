# 古籍活化引擎验证报告

验证对象：`content/demo`（《史记·留侯世家·圯上受履：五日之约》）

## 自动化结果

- `npm run check`：通过（文档、TypeScript、raw source、引文、claim、正史、资产与内容编译）。
- `npm test`：通过（故障 fixture、source importer、版本化存档、Ink 全分支、正史路线）。
- `npm run content:report`：通过，生成 `reports/demo/content-report.json`。
- `npm run build:all && npm run build:budget`：通过，生成 `dist/web` 与 `dist/studio` 并检查 gzip 预算。
- `npm run deploy:dry`：通过，Wrangler 3.112.0 解析 Worker 与静态资产配置。
- `quick_validate.py skills/build-classics-alive-game`：通过。
- `git diff --check`：通过。

## 浏览器冒烟

- Web：7 个正史选择均可抵达“正史结局”，4 个假设分支均明确显示为非原典路径。
- 重试：失败结局可回到上一个抉择；版本不一致的存档被拒绝。
- 窄屏：390×844 下无水平溢出；键盘 Enter 可触发已聚焦选择。
- Studio：审校台展示编译内容包中的所有 claims、来源、usage 与人工审校状态。

## 当前发布状态

内容已达到 `validated / awaiting-human-review`。历史底本与异文仍待史学顾问确认，SVG 资产为项目自制草图，真实 Cloudflare 预览尚未部署；因此不宣称已发布成品。
