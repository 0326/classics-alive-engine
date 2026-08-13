---
name: build-classics-alive-game
description: Transform an authorized classic text, historical source, or cultural text into a source-grounded, traceable Web game chapter. Use when Codex needs to import a book or chapter, extract source segments and claims, design an interactive narrative, author Ink, plan assets, update a Classics Alive content pack, or run evidence, branch, build, and browser QA checks.
---

# Build a Classics Alive Game

Use this workflow to turn a classic text into an editable content pack and a validated Web game chapter. Keep source text, interpretive claims, dramatic adaptation, generated assets, and runtime code separate. Never present inferred or invented material as a quotation or explicit fact.

## Workflow

1. **Inspect the repository.** Read `AGENTS.md`, `docs/technical-plan.md`, the target content pack, and available validation commands before editing. Preserve existing user changes.
2. **Define the slice and its executable target.** Choose one authorized book/chapter or character arc. Set target duration, player role, historical endpoint, number of choice nodes, endings, source-evidence coverage, and learning goal. Do not start with a whole book. Create `design/quality-targets.json` before authoring; it is the chapter's Definition of Done.
3. **Normalize sources.** Create stable source-segment IDs and preserve the supplied wording. Record edition, provenance, extraction/OCR warnings, and copyright status. Keep normalized text separate from the raw source.
4. **Build the evidence layer.** Extract characters, places, events, chronology, and `claims`. Every claim must have a certainty: `explicit`, `inferred`, `contested`, `invented`, or `counterfactual`, plus one or more source references when it describes the source world.
5. **Write the adaptation brief.** Define acts, player-facing choices, canonical route, failure/counterfactual outcomes, and what is intentionally dramatized. Resolve or surface conflicting sources; do not silently choose.
6. **Author Ink.** Use the project tag protocol. Put `#correct` only on evidence-backed canonical choices, attach `#evidence:<claim-id>`, and mark deaths and counterfactual outcomes explicitly. Keep long quotations in the source/learning layer and use `#hint:<source-segment-id>` for them.
7. **Plan assets.** Create stable IDs, era/style constraints, provenance, and concise accessible `alt` text before generating imagery. Placeholder assets are acceptable for a playable slice, but must be declared as placeholders; character assets require non-generic alternative text.
8. **Run the autonomous quality loop.** Run `npm run playability:gate`. If it fails, read `reports/<pack-id>/completion.json` and the referenced machine reports, repair only the reported failures, and run the gate again. Make at most three repair passes; do not weaken a validator or lower a target merely to pass it. Browser tests must derive the active story title, canonical route, counterfactual route, source panel, and ending from `generated/active`; never hard-code the previous chapter's labels. At 1280×720, the first dialogue card and at least one player choice must remain visible without scrolling.
9. **Report the result truthfully.** Only a passing `playability:gate` permits the label `validated`. `reviewed` requires a real named human reviewer in `review/approval.json`; do not write it on the agent's own authority. `ready-for-release` requires both technical validation and every configured human gate. Summarize files changed, gate result, citation coverage, unresolved historical questions, asset status, and the next human review gate.

## Non-negotiable quality gates

- A direct quotation must match its source segment after the documented normalization rules.
- A canonical choice must trace `story node → claim → source segment`.
- `invented` and `counterfactual` content must be labeled in source files and UI metadata.
- A story must compile, terminate or intentionally loop within a declared limit, and expose no dangling asset/death/achievement IDs.
- The canonical route must reach a declared canonical ending without triggering a death outcome.
- A chapter's `design/quality-targets.json` must define minimum source segments, claims, source-grounded claims, canonical route choices, major choices, endings, counterfactual choices, duration, and whether human historical review is required.
- Do not claim a publishable result when only the content draft has been generated; distinguish `draft`, `validated`, `reviewed`, and `ready-for-release`.

## Resource routing

- Read [content-contract.md](references/content-contract.md) when creating or validating a content pack.
- Read [quality-loop.md](references/quality-loop.md) before repairing a failed chapter or declaring a game playable.
- Read [historical-integrity.md](references/historical-integrity.md) when classifying claims, handling conflicting editions, or reviewing historical dialogue.
- Read [ink-authoring.md](references/ink-authoring.md) when writing or debugging `.ink` files.
- Read [asset-guidelines.md](references/asset-guidelines.md) when planning visual/audio assets or replacing placeholders.
- Run project scripts under `scripts/` or the root `npm` commands instead of inventing ad hoc validation.
- To forward-test an inactive pack without changing `game.config.json`, run `CAGE_CONTENT_PACK=<path> CAGE_STORY_ID=<id> npm run playability:gate`.
