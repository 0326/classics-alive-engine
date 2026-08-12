import { Compiler } from "inkjs/full";

export interface InkChoice { index: number; text: string; tags: string[]; }
export interface InkStep { text: string; tags: string[]; speaker?: string; }
export interface InkSnapshot { json: string; }

export class InkRunner {
	private readonly story: any;
	private readonly maxSteps: number;
	private readonly authoredChoiceTags = new Map<string, string[]>();
	private steps = 0;

	constructor(source: string, options: { maxSteps?: number } = {}) {
		this.story = new Compiler(source).Compile();
		this.maxSteps = options.maxSteps ?? 500;
		for (const match of source.matchAll(/^\s*\*\s*\[([^\]]+)\]\s*(.*)$/gm)) {
			const tags = [...match[2].matchAll(/#([\w-]+)(?::([^\s]+))?/g)].map((tag) => tag[2] ? `${tag[1]}:${tag[2]}` : tag[1]);
			this.authoredChoiceTags.set(match[1].trim(), tags);
		}
	}

	get canContinue(): boolean { return this.story.canContinue; }
	get currentChoices(): InkChoice[] {
		return this.story.currentChoices.map((choice: any) => ({ index: choice.index, text: choice.text, tags: choice.tags?.length ? choice.tags : this.authoredChoiceTags.get(choice.text.trim()) ?? [] }));
	}

	continue(): InkStep[] {
		if (!this.story.canContinue) return [];
		const output: InkStep[] = [];
		while (this.story.canContinue) {
			if (++this.steps > this.maxSteps) throw new Error(`Ink story exceeded ${this.maxSteps} steps`);
			const text = this.story.Continue() ?? "";
			const tags = this.story.currentTags ?? [];
			const speaker = tags.find((tag: string) => tag.startsWith("speaker:"))?.slice("speaker:".length);
			if (text.trim()) output.push({ text: text.trim(), tags, speaker });
			if (output.length >= 1) break;
		}
		return output;
	}

	choose(index: number): void {
		if (!this.currentChoices.some((choice) => choice.index === index)) throw new Error(`Invalid Ink choice index: ${index}`);
		this.story.ChooseChoiceIndex(index);
	}
	snapshot(): InkSnapshot { return { json: this.story.state.ToJson() }; }
	restore(snapshot: InkSnapshot): void { this.story.state.LoadJson(snapshot.json); }
}
