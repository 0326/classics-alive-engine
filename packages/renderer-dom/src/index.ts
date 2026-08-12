export interface StageState {
	background?: string;
	characters?: Array<{ id: string; expression?: string; position?: string }>;
}

export interface StageRenderer {
	setState(state: StageState): void;
	clear(): void;
}

export class DomStageRenderer implements StageRenderer {
	private state: StageState = {};
	setState(state: StageState): void { this.state = state; }
	clear(): void { this.state = {}; }
	getState(): StageState { return this.state; }
}
