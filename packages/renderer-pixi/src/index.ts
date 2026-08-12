import type { StageRenderer, StageState } from "@cage/renderer-dom";

/** Optional high-performance profile. The web app does not load this package by default. */
export class PixiStageRenderer implements StageRenderer {
	private state: StageState = {};
	setState(state: StageState): void { this.state = state; }
	clear(): void { this.state = {}; }
	getState(): StageState { return this.state; }
}
