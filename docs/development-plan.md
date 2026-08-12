# 古籍活化游戏引擎开发计划

## 交付策略

采用“先垂直切片、后平台化”的开发方式。首个可接受成果不是完整《史记》，而是一个从原始文本到可发布 Web 游戏都可复现的 10–20 分钟章节。

建议第一个切片选择来源清楚、人物集中、事件链完整的传记或单篇章节；它必须使用新内容包重新生产，不得直接搬运旧项目的数据文件。

### 计划使用方式

本计划按“阶段门”推进，而不是按日历承诺推进。每个阶段只有在其验收证据齐全后才进入下一阶段；如果输入文本、版权、史料争议或浏览器验证未就绪，阶段保持进行中，不用新增功能掩盖阻塞项。

每个工作单必须产生可提交的文件，而不是只产生聊天结论：

```text
输入材料 → 内容/代码变更 → 自动检查 → 人工审阅记录 → 下一阶段决策
```

## 里程碑

| 阶段 | 目标 | 主要交付 | 完成标准 |
|---|---|---|---|
| Phase 0 | 定义边界 | Monorepo、schema 草案、Agent 规则、skill 骨架 | 空 fixture 能通过类型与 schema 校验 |
| Phase 1 | 建立证据链 | 文本导入、source segment、claim、验证器 | 一个小样本从引文到 claim 可双向追溯 |
| Phase 2 | 跑通叙事 | Ink core、历史适配器、正史与分支验证 | 2–3 分钟样本可全分支运行 |
| Phase 3 | 做成 Web 游戏 | React 游戏页、DOM 舞台、存档、backlog、学习反馈 | 玩家可在桌面和手机完成完整路径 |
| Phase 4 | 真实垂直切片 | 一条 10–20 分钟人物/事件线 | 人工审校通过、报告完整、可部署 |
| Phase 5 | 生产化 | CI、部署、内容 PR 规范、性能与无障碍 | 合并请求可自动阻止无证据或不可玩内容 |
| Phase 6 | 扩展能力 | Pixi profile、审核台、云能力 | 不破坏已发布内容包与运行时契约 |

## 阶段依赖与出口条件

```text
P0 协议基线
 └─> P1 证据链
      └─> P2 叙事核心
           └─> P3 Web 播放器
                └─> P4 真实垂直切片
                     └─> P5 发布工程化
                          └─> P6 扩展能力
```

每个阶段的出口证据：

| 阶段 | 必须存在的证据 | 不得带入下一阶段的问题 |
|---|---|---|
| P0 | `npm run check`、schema fixture、skill 校验报告 | 未定义 ID、状态枚举或目录边界 |
| P1 | source/claim 双向引用报告、故意错误的失败测试 | 无来源 claim、引文无法匹配、版本信息缺失 |
| P2 | 无头 Ink 分支报告、存档恢复测试 | 悬空标签、死循环、正史路线无法判定 |
| P3 | Playwright 主路径、窄屏截图、键盘路径 | 玩家无法读档、证据提示不可见、核心 UI 无法操作 |
| P4 | 人工史学/叙事/视觉审阅记录 | 关键历史争议未标注、占位素材冒充成品 |
| P5 | CI 记录、预览 URL、发布检查报告 | 本地通过但 CI 或部署环境失败 |
| P6 | 兼容性与迁移测试 | 新 renderer 或 studio 破坏既有内容包 |

## Definition of Done

### 代码任务

- 明确修改范围与不变行为。
- 有最小回归测试，或在任务记录中说明为什么不适合自动化。
- `lint`、`typecheck`、相关单测和相关内容验证通过。
- 不引入未经记录的运行时依赖、环境变量或外部服务。

### 内容任务

- 所有新增 source、claim、story node 和 asset ID 唯一且稳定。
- 关键选择与结局都有证据链或明确的 `invented/counterfactual` 标记。
- 有 adaptation brief 记录删改、压缩、合并和冲突处理。
- 自动验证报告与人工审阅待办一起提交。

### 发布任务

- 生成可复现的构建产物和版本号。
- 预览环境完成正史、失败、存档、重试和移动端冒烟。
- 报告中区分 `draft`、`validated`、`reviewed`、`released` 四种状态。

## Phase 0：项目骨架与协议

### 当前执行状态

已完成本阶段的第一批基线工作：

- 根级 `package.json`、workspace 配置和 TypeScript 配置已建立；
- `packages/schema` 已有首版领域类型；
- `content/demo` 已有 3 段 source、2 条 claim 和 certainty 约束；
- `scripts/validate-content.mjs` 已能检测缺失 source、重复 ID、非法 certainty 和无 usages claim；
- `scripts/test-validator.mjs` 已覆盖有效与故障 fixture；
- `skills/build-classics-alive-game` 已通过 skill frontmatter 校验；
- `npm run check` 已通过文档、TypeScript 与 demo 内容验证。

阶段状态：已完成（待首次提交）。schema 类型、内容 fixture、故障 fixture、workflow skill 和统一检查命令均已落地；仓库不再忽略 `docs/` 与验证报告。

任务：

1. 初始化 npm workspace、TypeScript 与显式检查命令。
2. 建立 `apps/`、`packages/`、`content/`、`skills/`、`tests/` 目录边界。
3. 在 `@cage/schema` 中定义 `BookManifest`、`SourceSegment`、`Claim`、`StoryManifest`、`AssetManifest` 的首版 Zod schema。
4. 建立最小 `content/demo/` fixture：3 段原文、2 条 claim、1 个选择和 2 个结局。
5. 初始化 `build-classics-alive-game` skill；创建后运行 skill validator。
6. 设置根命令：`lint`、`typecheck`、`test`、`content:validate`、`check`。

验收：根目录 `npm run check` 通过；fixture 能被 schema 读取并生成机器可读诊断。

## Phase 1：史料标准化与证据校验

阶段状态：已完成自动化闭环，待史学人审。`scripts/import-source.mjs` 支持 TXT/Markdown 段落导入并生成 extraction report；验证器现检查 raw source、直接引文、claim usage、正史 evidence、结局 registry 与资产文件。

任务：

1. 实现 Markdown/TXT 导入；PDF 仅生成提取结果与 OCR 风险报告，不自动视为可信文本。
2. 按卷、篇、节、段生成稳定 source segment ID。
3. 实现 claim 的来源存在性、状态合法性、未使用 claim 和无来源叙事检查。
4. 实现直接引文文本规范化与匹配。
5. 实现人物首次/末次出现、事件时间范围和地点引用的基础校验。
6. 输出 `citation-coverage.md` 与 `validation.json`。

验收：人为改错一个引文、一个 claim ID 和一条时间线，验证器均能精确报错。

## Phase 2：互动叙事核心

阶段状态：已完成。Ink 全分支遍历、正史路线、死亡/成就标签、回退和内容/剧本版本化存档已由 `packages/ink-vn-core` 与 `packages/historical-adapter` 提供。

任务：

1. 从 `timeslip-shiji` 提炼可复用的 Ink runner 与 tag parser；只迁移通用逻辑，不迁移《史记》业务数据。
2. 实现 `HistoricalAdapter`：证据、正确选择、死亡、成就、backlog、抉择点回退与版本化存档。
3. 实现 `#evidence`、`#status`、`#correct`、`#death`、`#achieve`、`#counterfactual` 校验。
4. 建立全分支遍历、正史路线通关与循环保护。
5. 为标签解析、存档恢复和正史路径编写 golden tests。

验收：demo Ink 在无 UI 环境下可编译、遍历、恢复快照，并输出一条可读的正史路线。

## Phase 3：Web VN 应用

阶段状态：已完成。React Web 播放器直接消费 `generated/active` 内容包，包含原典侧栏、回看、IndexedDB 存档/读档、失败重试、响应式窄屏布局、键盘路径和 Playwright 冒烟验证。

任务：

1. 建立游戏路由、故事选择页、播放页和结局页。
2. 实现背景、立绘、BGM、说话人、对话、选项、提示、死亡卡与成就卡。
3. 实现 IndexedDB 存档、backlog、设置与键盘操作。
4. 建立典籍阅读侧栏：原文、译注、证据来源和“本段内容状态”。
5. 实现响应式布局、减少动态效果偏好和基础无障碍标签。
6. 编写 Playwright：正史通关、失败重试、读档、窄屏、键盘选择。

验收：无后端情况下，手机和桌面浏览器均可离线完成 demo 故事。

## Phase 4：真实典籍垂直切片

阶段状态：自动化验收完成，人工发布门未完成。`content/demo` 是《史记·留侯世家·圯上受履》的 12 分钟切片（9 source segment、7 个正史抉择、4 个假设结局）；它有 adaptation brief、scene blueprint、learning、真实 SVG 草图与审校待办。史学顾问审校和正式美术仍是发布门。

建议规格：

- 10–20 分钟主线。
- 6–8 个主要抉择点。
- 1 条正史路线。
- 3–5 个明确解释的失败或假设历史结局。
- 至少 8 条关键 claim，且每条均有 source segment。
- 5–8 个背景、3–6 个角色形象；未完成美术可使用标记明确的占位资产。

任务：

1. 导入经过人工确认的原始文本。
2. 完成 evidence、design、Ink、learning、asset manifest。
3. 完成史学、叙事与视觉三轮人工审阅。
4. 修复所有阻断级验证问题。
5. 部署预览并完成外部试玩。

验收：审校者可从每个关键 `#correct` 或结局解释跳回原文来源；试玩者可无需说明完成一轮正史通关。

## Phase 5：工程化与发布

阶段状态：基础工程化完成。GitHub Actions 运行内容、回归、构建预算、Wrangler dry-run 与 Playwright；真实 Cloudflare 预览 URL 需要有部署凭据后再验收。

任务：

1. 建立 GitHub Actions：依赖安装、类型检查、单元测试、内容验证、Ink 验证、Playwright。
2. 为内容变更建立 PR 模板：来源、claim、新增虚构、分支影响、验证报告。
3. 配置 Cloudflare 预览部署与生产部署。
4. 加入性能预算：首屏、首个故事资产、音频、图片体积。
5. 建立异常、构建和内容校验的结构化日志。

验收：任何缺少来源、失效 asset ID、不可通关正史路线或浏览器冒烟失败的变更都不能合并。

## Phase 6：扩展能力

阶段状态：部分完成。DOM 是默认 renderer，`apps/studio` 已直接读取编译内容包；Pixi profile 仅保留接口边界，尚未接入真实 Pixi 演出，不能作为已交付能力宣传。

## 风险与应对

| 风险 | 应对 |
|---|---|
| Agent 编造史料 | 所有关键内容要求 claim，claim 要求 source ref；缺失即阻断。 |
| 典籍 OCR 错误 | 原文本与规范化文本并存；OCR 报告进入人工审核。 |
| 分支爆炸 | 主线允许汇流；失败结局短路；限制单章节决策预算。 |
| 资产制作拖慢剧情 | 资产 manifest 与占位素材先行，正式美术后置替换。 |
| 过早建设编辑器 | v1 只用 Git + Markdown/YAML + Agent workflow；真实生产痛点稳定后才做 studio。 |
| 渲染技术复杂化 | DOM renderer 默认；Pixi 仅作为明确声明的可选 profile。 |

## 首个开发迭代的任务顺序

1. 建立 workspace 与基础命令。
2. 实现 schema 与 `content/demo` fixture。
3. 实现 `content:validate`。
4. 初始化并验证 workflow skill。
5. 提炼 Ink core，完成无头 narrative test。
6. 建立最小 Web 播放页。
7. 用真实古籍篇章替换 demo，完成垂直切片。

在第 7 步验收之前，不引入账号、云端数据库、Pixi、3D、编辑器或多 Agent 调度服务。

## 首个迭代的交付清单

首个迭代结束时，仓库应至少包含：

- 根级 `package.json`、workspace 配置和统一检查命令；
- `packages/schema` 的首版类型与内容 fixture；
- `scripts/validate-content.mjs` 及至少三类故障 fixture；
- `skills/build-classics-alive-game/SKILL.md` 与引用文档；
- 一份机器可读的验证报告和一份面向人的决策记录；
- 一条明确的下一阶段入口：选择真实典籍、确认版本与确定垂直切片范围。

若这些交付物未齐全，Phase 0 不得标记为完成。
