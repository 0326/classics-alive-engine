# 古籍活化游戏引擎技术方案

## 1. 定位与目标

古籍活化游戏引擎（Classics Alive Game Engine，暂用缩写 CAGE）是一套本地优先、内容可追溯、面向 Web 发布的互动叙事生产平台。

它不是“把古文丢给模型后一键出游戏”的黑箱，也不是绑定某个模型的低代码编辑器。它的核心是一个可版本管理的内容包：原典段落、史实断言、改编结构、Ink 剧本、学习材料与资产计划都以独立文件保存，并通过可执行校验关联。

首期目标：输入一个已授权典籍篇章，交付一个 10–20 分钟、可在浏览器游玩的互动历史章节，并能从每个关键选择回溯到原典依据。

非目标：整书自动生成、通用桌面打包器、自动史学裁决、多人编辑器、账号体系和复杂实时 AI 叙事。

## 2. 总体架构

```text
古籍文件 / 既有结构化文本
  → source importer（规范化、章节/段落 ID、OCR 报告）
  → source pack（原文与版本信息）
  → canon pack（人物、事件、时间线、claims）
  → design pack（改编蓝图、幕结构、场景计划）
  → Ink 与学习内容
  → content compiler（生成 Web 可消费数据）
  → React Web 游戏
  → validator + Playwright QA + 部署
```

Agent（Codex、Claude、Trae）只负责在每个明确步骤中创建或修改源内容、代码和资产计划；验证器与构建器不依赖 Agent 运行。

## 3. 技术栈

| 范畴 | 决策 | 说明 |
|---|---|---|
| 仓库 | npm workspaces + TypeScript | 共享类型、脚本和应用，适合渐进扩展。 |
| 构建编排 | npm scripts | 当前规模以显式内容编译和检查命令保持可读；需要缓存时再引入 Turborepo。 |
| Schema | Zod + JSON Schema | 本地类型、运行时验证和 Agent 输出协议使用同一份定义。 |
| 叙事 | Ink + inkjs | 剧本可读、可汇流、可分支遍历，适用于视觉小说。 |
| Web 应用 | React + Vite | 游戏、典籍阅读与审核台共享前端能力；路由按多章节需要再引入。 |
| 状态 | HistoricalRunner + React local state | 首期保存叙事状态、存档和 UI 状态，避免早期引入全局状态。 |
| 默认渲染 | DOM/CSS | 可访问、移动端友好、维护成本低。 |
| 高演出 profile | PixiJS / Pixi'VN（后置） | 仅用于地图、战役、粒子与镜头等 Canvas 场景。 |
| 本地持久化 | IndexedDB | 首期离线存档，不依赖账户系统。 |
| 云能力 | Cloudflare Workers + D1 + R2（后置） | 云存档、统计、授权内容和素材托管。 |
| 测试 | Node regression scripts + Playwright | 逻辑、内容、全分支和浏览器体验分层验证。 |

## 4. Monorepo 结构

```text
classics-alive-engine/
├── apps/
│   ├── web/                         # 面向玩家的 Web 游戏
│   └── studio/                      # v2：内容审核与编辑台
├── packages/
│   ├── schema/                      # 所有 Zod / JSON Schema
│   ├── source-importer/             # TXT/MD/PDF 导入与分段
│   ├── ink-vn-core/                 # Ink runner、标签解析、存档
│   ├── historical-adapter/          # 证据、正史、死亡、成就语义
│   ├── content-compiler/            # 内容包 → Web 数据
│   ├── content-validator/           # 内容、图、证据、资产校验
│   ├── renderer-dom/                # 默认 VN 舞台
│   └── renderer-pixi/               # v2 可选渲染 profile
├── content/                         # 典籍内容包
├── skills/build-classics-alive-game/ # canonical Agent skill
├── scripts/                         # 对人和 Agent 均可执行的 CLI
├── tests/                           # fixture、golden 数据与 e2e
└── docs/
```

`packages/` 只依赖其他 packages；不得导入 `apps/` 或具体典籍内容。`apps/web` 只消费构建后内容，不直接解析 PDF 或未校验的源文件。

## 5. 内容包协议

每部典籍使用一个独立内容包：

```text
content/<classic-id>/
├── manifest.yaml
├── sources/
│   ├── edition.yaml
│   ├── segments.jsonl
│   └── extraction-report.json
├── canon/
│   ├── characters.yaml
│   ├── places.yaml
│   ├── events.yaml
│   ├── chronology.yaml
│   └── claims.jsonl
├── design/
│   ├── adaptation-brief.md
│   ├── storylines.yaml
│   └── scene-blueprints.yaml
├── stories/<story-id>/
│   ├── story.ink
│   ├── story.yaml
│   └── outcomes.yaml
├── learning/
│   ├── reader.yaml
│   ├── knowledge.yaml
│   └── quizzes.yaml
└── assets/
    ├── manifest.yaml
    └── prompts/
```

### 5.1 三类稳定 ID

- `source-segment-id`：原典段落，如 `shiji.092.014`。
- `claim-id`：可核验断言，如 `claim.hanxin.kuaxia`。
- `story-node-id`：叙事节点，如 `hanxin.act-01.choice-01`。

所有关键叙事必须满足 `source segment → claim → story node / outcome` 的可追溯链。`claim` 必须标记 `explicit`、`inferred`、`contested`、`invented` 或 `counterfactual`。

### 5.2 Claim 示例

```yaml
id: claim.hanxin.kuaxia
kind: event
statement: 韩信曾受胯下之辱。
certainty: explicit
sourceRefs:
  - shiji.092.014
usages:
  - story:hanxin.act-01.choice-01
  - outcome:hanxin.kuaxia
```

## 6. 互动叙事协议

Ink 是唯一剧本语言。标签分为通用舞台标签与历史领域标签。

```text
#bg:huaiyin_street
#show:tuzhong:mocking:right
#bgm:lonely_market
#speaker:韩信
#transition:fade

#evidence:claim.hanxin.kuaxia
#status:explicit
#hint:shiji.092.014
#correct
#death:hanxin.kuaxia
#achieve:hanxin.endure
#counterfactual:hanxin.kill-youth
```

约束：

1. 每个 `#correct` 选项必须存在 `#evidence`。
2. `#evidence` 指向的 claim 必须存在，并能回溯到 source segment。
3. 正史路径不允许进入 `counterfactual` 或未审核的 `invented` 内容。
4. 直接引文必须来自对应 source segment，并进行文本匹配。
5. 死亡、成就和资产 ID 必须在对应 registry 注册。

## 7. 运行时

运行时以接口隔离内容和渲染：

```text
InkRunner
  → HistoricalAdapter
  → NarrativeState
  → StageRenderer
      ├── DomStageRenderer（默认）
      └── PixiStageRenderer（可选）
```

`HistoricalAdapter` 负责解释证据、正史、死亡、成就、提示和存档附加状态；它不负责具体 CSS、Pixi 或页面路由。默认 DOM 渲染器服务大多数章节；内容包显式指定 `renderer: pixi` 时才按需加载 Pixi profile。

存档必须序列化：Ink 快照、场景状态、抉择点快照栈、统计、backlog、内容包版本和剧本版本。版本不兼容时给出可理解的恢复提示，不静默读取错误状态。

## 8. Agent Skill 与 CLI

仓库保存 canonical skill：`skills/build-classics-alive-game/`。它包含精简 `SKILL.md`、引用规范、内容模板和确定性脚本；在 Codex、Claude、Trae 中只安装同一份源，不维护三套规则。

预期 CLI：

```text
npm run content:intake -- ./sources/shiji.md ./content/shiji shiji
npm run content:validate -- ./content/shiji
npm run content:compile -- ./content/shiji <story-id>
npm run story:verify -- ./content/shiji/stories/<story-id>.ink
npm run story:canon -- ./content/shiji/stories/<story-id>.ink
npm run test:e2e
```

工作单固定为：史料整理、历史断言、改编设计、Ink 创作、资产规划和质量审校。它们可以由一个 Agent 顺序执行，也可以由多个 Agent 独立完成；所有中间结果必须写入内容包。

## 9. 验证与发布

验证器应至少覆盖：

- schema 与 ID 唯一性；
- source 引用存在性与直接引文匹配；
- claim 使用覆盖率；
- 人物、地点与时间线冲突；
- Ink 编译、标签、死循环、全分支遍历；
- 正史路线通关与正确结局；
- 死亡、成就、资产与小游戏 ID 注册；
- Web 构建、存读档、键盘操作、手机视图和关键玩家路径。
- `design/quality-targets.json` 所声明的章节时长、证据、分支、结局和人工审校门槛。

`npm run playability:gate` 必须串行运行内容质量、静态检查、回归、生产构建、体积预算、浏览器试玩和部署 dry-run，并生成 `reports/<book>/quality-gate.json` 与 `completion.json`。只有 `completion.json` 无阻断项时才允许技术交付；若内容包要求人工史学审核，则发布状态仍为 `blocked:human-historical-review`，直到审核记录真实更新。

## 10. 后续扩展

v2 再引入审校工作台、Pixi 高演出、云存档、协作审核和内容统计。v3 可建立不同古籍 profile，例如史书、笔记、神话、医书、地方志；profile 改变内容规则与玩法模板，但不改变 source/claim/story 的核心追溯模型。
