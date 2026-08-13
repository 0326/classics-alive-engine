import { useState } from "react";
import { HistoricalRunner, type HistoricalSave } from "@cage/historical-adapter";
import { activeContent, storySource } from "./active-content";
import { loadGame, saveGame } from "./persistence";

const identity = { contentPackId: activeContent.manifest.id, contentVersion: activeContent.manifest.version, storyId: activeContent.story.id, storyVersion: activeContent.story.version };
const SAVE_KEY = `${identity.contentPackId}-${identity.storyId}-v${identity.contentVersion}`;
const assetModules = import.meta.glob("../../../generated/active/assets/**/*.svg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const assetUrl = (id?: string) => {
	const asset = activeContent.assets.assets.find((item) => item.id === id);
	if (!asset) return undefined;
	return Object.entries(assetModules).find(([file]) => file.endsWith(`/assets/${asset.path}`))?.[1];
};
const assetAlt = (id: string) => activeContent.assets.assets.find((item) => item.id === id)?.alt ?? id;
const statusLabel = (status?: string | true) => status === "explicit" ? "原典明确记载" : status === "counterfactual" ? "假设历史分支" : "改编叙事连接";

export function App() {
	const [runner] = useState(() => { const instance = new HistoricalRunner(storySource, identity); instance.advance(); return instance; });
	const [, refresh] = useState(0);
	const [panel, setPanel] = useState<"source" | "backlog" | null>("source");
	const [message, setMessage] = useState("原典、改编和假设分支均可回溯。\n");
	const state = runner.state();
	const segment = state.segment;
	const evidenceId = typeof segment?.meta.evidence === "string" ? segment.meta.evidence : undefined;
	const hintId = typeof segment?.meta.hint === "string" ? segment.meta.hint : undefined;
	const canonicalChoice = state.choices.find((choice) => choice.meta.correct);
	const choiceEvidence = typeof canonicalChoice?.meta.evidence === "string" ? canonicalChoice.meta.evidence : undefined;
	const choiceHint = typeof canonicalChoice?.meta.hint === "string" ? canonicalChoice.meta.hint : undefined;
	const displayedEvidenceId = evidenceId ?? choiceEvidence;
	const claim = activeContent.claims.find((item) => item.id === displayedEvidenceId);
	const sourceId = hintId ?? choiceHint ?? claim?.sourceRefs?.[0] ?? activeContent.segments[0]?.id;
	const source = sourceId ? activeContent.reader.segments[sourceId as keyof typeof activeContent.reader.segments] : undefined;
	const isDeath = state.deaths.length > 0;
	const achievement = activeContent.outcomes.achievements.find((item) => state.achievements.includes(item.id));

	const advance = () => { runner.advance(); refresh((value) => value + 1); };
	const choose = (index: number) => { runner.choose(index); runner.advance(); refresh((value) => value + 1); setMessage("你的选择已写入当前故事版本。\n"); };
	const retry = () => { if (runner.retry()) { refresh((value) => value + 1); setMessage("已回到上一个抉择点，失败分支没有写入回看。\n"); } };
	const save = async () => { try { await saveGame(SAVE_KEY, runner.save()); setMessage("存档已保存到本机，包含内容与剧本版本。\n"); } catch { setMessage("存档失败，请检查浏览器的本机存储权限。\n"); } };
	const load = async () => { try { const saved = await loadGame<HistoricalSave>(SAVE_KEY); if (!saved) setMessage("还没有此版本的本机存档。\n"); else { runner.load(saved); refresh((value) => value + 1); setMessage("已恢复与当前内容版本匹配的存档。\n"); } } catch { setMessage("存档版本不匹配或数据损坏，未读取。\n"); } };

	return <main className="app-shell">
		<header className="topbar"><div className="brand"><span className="brand-mark">古</span><div><p>古籍活化</p><small>CLASSICS ALIVE ENGINE</small></div></div><div className="top-actions"><button aria-pressed={panel === "source"} onClick={() => setPanel(panel === "source" ? null : "source")}>原典</button><button aria-pressed={panel === "backlog"} onClick={() => setPanel(panel === "backlog" ? null : "backlog")}>回看</button><button onClick={() => void save()}>存档</button><button onClick={() => void load()}>读档</button></div></header>
		<section className="story-layout">
			<div className="stage-wrap">
				<div className="stage" aria-label={`${activeContent.story.title} 场景`} style={state.stage.background ? { backgroundImage: `linear-gradient(rgba(8,15,26,.28), rgba(8,15,26,.72)), url(${assetUrl(state.stage.background)})` } : undefined}>
					<div className="mist mist-one" /><div className="mist mist-two" />
					<div className="character-layer">{state.stage.characters.map((character, index) => <img key={character} className={`character character-${index}`} src={assetUrl(character)} alt={assetAlt(character)} />)}</div>
					<div className="scene-caption">{activeContent.story.title} · {source?.title ?? "叙事进行中"}</div>
				</div>
				<div className="progress-line"><span style={{ width: `${Math.min(100, Math.max(8, state.backlog.length * 10))}%` }} /></div>
				<div className="dialogue-card">
					<div className="dialogue-meta"><span>{segment?.speaker ?? "旁白"}</span><small>{message}</small></div>
					<p className="dialogue-text">{segment?.text ?? "故事正在等你翻开下一页。"}</p>
					<div className={`status-chip ${segment?.meta.status ?? "dramatized"}`}>{statusLabel(segment?.meta.status)}</div>
					{state.choices.length > 0 ? <div className="choices">{state.choices.map((choice) => <button key={choice.index} className={choice.meta.correct ? "choice canonical" : "choice"} onClick={() => choose(choice.index)}><span>{String(choice.index + 1).padStart(2, "0")}</span>{choice.text}</button>)}</div> : state.ended ? <div className="ending-actions"><div className={isDeath ? "outcome death" : "outcome canon"}>{isDeath ? "假设分支 · 这一次没有走到原典的终点" : `正史结局 · ${achievement?.title ?? "圯上受履"}`}</div><button className="primary" onClick={retry}>{isDeath ? "回到抉择" : "从上个抉择重读"}</button></div> : <button className="primary continue" onClick={advance}>继续 <span>→</span></button>}
				</div>
			</div>
			<aside className={`side-panel ${panel ? "open" : ""}`} aria-live="polite">
				{panel === "source" && <><div className="panel-kicker">SOURCE NOTE / {sourceId ?? "unlinked"}</div><h2>{source?.title ?? "原典摘录"}</h2><blockquote>{source?.original ?? "此段是改编连接，未作为原典引文呈现。"}</blockquote><p>{source?.vernacular ?? "请在相邻的有证据节点查看原文与译解。"}</p><div className="evidence-chip">证据链 · {displayedEvidenceId ?? "dramatized-link"}</div><div className="panel-rule" /><p className="panel-note">{claim?.statement ?? "这段场景连接已标记为改编，不把它伪装成原文。"}</p></>}
				{panel === "backlog" && <><div className="panel-kicker">BACKLOG / {state.backlog.length} STEPS</div><h2>行旅札记</h2><div className="backlog">{state.backlog.map((item, index) => <div key={`${item.text}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.text}</p></div>)}</div></>}
			</aside>
		</section>
		<footer className="footer"><span>内容包：{identity.contentPackId} · v{identity.contentVersion}</span><span>史学状态：{activeContent.review.reviewers.historical.status}</span></footer>
	</main>;
}
