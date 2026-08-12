import { InkRunner, type InkChoice, type InkSnapshot, type InkStep } from "@cage/ink-vn-core";

export type Meta = Record<string, string | true>;
export interface NarrativeSegment { text: string; tags: string[]; meta: Meta; speaker?: string; }
export interface NarrativeChoice extends InkChoice { meta: Meta; }
export interface StageState { background?: string; characters: string[]; }
export interface ContentIdentity { contentPackId: string; contentVersion: string; storyId: string; storyVersion: string; }
export interface HistoricalState { segment: NarrativeSegment | null; choices: NarrativeChoice[]; backlog: NarrativeSegment[]; deaths: string[]; achievements: string[]; stage: StageState; ended: boolean; }
export interface HistoricalSave { formatVersion: 1; identity: ContentIdentity; core: InkSnapshot; backlog: NarrativeSegment[]; deaths: string[]; achievements: string[]; stage: StageState; createdAt: string; }
interface InternalSnapshot { core: InkSnapshot; backlogLength: number; deathsLength: number; achievementsLength: number; stage: StageState; }

export function parseMeta(tags: string[]): Meta {
	const meta: Meta = {};
	for (const tag of tags) {
		const index = tag.indexOf(":");
		if (index < 0) meta[tag] = true;
		else meta[tag.slice(0, index)] = tag.slice(index + 1);
	}
	return meta;
}

export class HistoricalRunner {
	readonly core: InkRunner;
	readonly identity: ContentIdentity;
	private readonly snapshots: InternalSnapshot[] = [];
	private readonly backlog: NarrativeSegment[] = [];
	private readonly deaths: string[] = [];
	private readonly achievements: string[] = [];
	private stage: StageState = { characters: [] };
	private current: NarrativeSegment | null = null;
	private pendingChoice: NarrativeChoice | null = null;

	constructor(source: string, identity: ContentIdentity) { this.core = new InkRunner(source); this.identity = identity; }
	advance(): NarrativeSegment | null {
		const [step] = this.core.continue();
		if (!step) return null;
		this.current = this.toSegment(step, this.pendingChoice?.meta);
		this.pendingChoice = null;
		this.updateStage(this.current.tags);
		this.backlog.push(this.current);
		if (typeof this.current.meta.death === "string") this.deaths.push(this.current.meta.death);
		if (typeof this.current.meta.achieve === "string") this.achievements.push(this.current.meta.achieve);
		return this.current;
	}
	choices(): NarrativeChoice[] { return this.core.currentChoices.map((choice) => ({ ...choice, meta: parseMeta(choice.tags) })); }
	choose(index: number): void {
		this.snapshots.push({ core: this.core.snapshot(), backlogLength: this.backlog.length, deathsLength: this.deaths.length, achievementsLength: this.achievements.length, stage: { background: this.stage.background, characters: [...this.stage.characters] } });
		if (this.snapshots.length > 50) this.snapshots.shift();
		this.pendingChoice = this.choices().find((choice) => choice.index === index) ?? null;
		this.core.choose(index);
		this.current = null;
	}
	retry(): boolean {
		const snapshot = this.snapshots.pop();
		if (!snapshot) return false;
		this.core.restore(snapshot.core);
		this.backlog.splice(snapshot.backlogLength);
		this.deaths.splice(snapshot.deathsLength);
		this.achievements.splice(snapshot.achievementsLength);
		this.stage = { background: snapshot.stage.background, characters: [...snapshot.stage.characters] };
		this.pendingChoice = null;
		this.current = this.backlog.at(-1) ?? null;
		return true;
	}
	state(): HistoricalState {
		return { segment: this.current, choices: this.choices(), backlog: [...this.backlog], deaths: [...this.deaths], achievements: [...this.achievements], stage: { background: this.stage.background, characters: [...this.stage.characters] }, ended: !this.core.canContinue && this.choices().length === 0 };
	}
	save(): HistoricalSave { return { formatVersion: 1, identity: this.identity, core: this.core.snapshot(), backlog: [...this.backlog], deaths: [...this.deaths], achievements: [...this.achievements], stage: { background: this.stage.background, characters: [...this.stage.characters] }, createdAt: new Date().toISOString() }; }
	load(save: HistoricalSave): void {
		if (save.formatVersion !== 1) throw new Error("This save uses an unsupported format.");
		if (Object.entries(this.identity).some(([key, value]) => save.identity?.[key as keyof ContentIdentity] !== value)) throw new Error("This save belongs to a different content or story version.");
		this.core.restore(save.core);
		this.snapshots.splice(0);
		this.backlog.splice(0, this.backlog.length, ...save.backlog);
		this.deaths.splice(0, this.deaths.length, ...save.deaths);
		this.achievements.splice(0, this.achievements.length, ...save.achievements);
		this.stage = { background: save.stage?.background, characters: [...(save.stage?.characters ?? [])] };
		this.pendingChoice = null;
		this.current = null;
	}
	private toSegment(step: InkStep, inherited?: Meta | null): NarrativeSegment { const meta = { ...(inherited ?? {}), ...parseMeta(step.tags) }; return { text: step.text, tags: step.tags, meta, speaker: step.speaker ?? (typeof inherited?.speaker === "string" ? inherited.speaker : undefined) }; }
	private updateStage(tags: string[]): void {
		for (const tag of tags) {
			if (tag.startsWith("bg:")) this.stage.background = tag.slice("bg:".length);
			if (tag.startsWith("show:")) { const id = tag.slice("show:".length); if (!this.stage.characters.includes(id)) this.stage.characters.push(id); }
			if (tag.startsWith("hide:")) this.stage.characters = this.stage.characters.filter((id) => id !== tag.slice("hide:".length));
		}
	}
}
