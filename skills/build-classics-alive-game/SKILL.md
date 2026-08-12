---
name: build-classics-alive-game
description: Transform an authorized classic text, historical source, or cultural text into a source-grounded, traceable Web game chapter. Use when Codex needs to import a book or chapter, extract source segments and claims, design an interactive narrative, author Ink, plan assets, update a Classics Alive content pack, or run evidence, branch, build, and browser QA checks.
---

# Build a Classics Alive Game

Use this workflow to turn a classic text into an editable content pack and a validated Web game chapter. Keep source text, interpretive claims, dramatic adaptation, generated assets, and runtime code separate. Never present inferred or invented material as a quotation or explicit fact.

## Workflow

1. **Inspect the repository.** Read `AGENTS.md`, `docs/technical-plan.md`, the target content pack, and available validation commands before editing. Preserve existing user changes.
2. **Define the slice.** Choose one authorized book/chapter or character arc. Set target duration, player role, historical endpoint, number of choice nodes, and learning goal. Do not start with a whole book.
3. **Normalize sources.** Create stable source-segment IDs and preserve the supplied wording. Record edition, provenance, extraction/OCR warnings, and copyright status. Keep normalized text separate from the raw source.
4. **Build the evidence layer.** Extract characters, places, events, chronology, and `claims`. Every claim must have a certainty: `explicit`, `inferred`, `contested`, `invented`, or `counterfactual`, plus one or more source references when it describes the source world.
5. **Write the adaptation brief.** Define acts, player-facing choices, canonical route, failure/counterfactual outcomes, and what is intentionally dramatized. Resolve or surface conflicting sources; do not silently choose.
6. **Author Ink.** Use the project tag protocol. Put `#correct` only on evidence-backed canonical choices, attach `#evidence:<claim-id>`, and mark deaths and counterfactual outcomes explicitly. Keep long quotations in the source/learning layer and use `#hint:<source-segment-id>` for them.
7. **Plan assets.** Create stable IDs and era/style constraints before generating imagery. Placeholder assets are acceptable for a playable slice, but must be declared as placeholders.
8. **Validate before presenting.** Run schema/content checks, Ink compilation and all-branch traversal, canonical-route verification, asset-ID checks, and the relevant browser smoke tests. Fix blockers instead of weakening validators.
9. **Report the result.** Summarize files changed, validation commands and results, citation coverage, unresolved historical questions, placeholder assets, and the next human review gate.

## Non-negotiable quality gates

- A direct quotation must match its source segment after the documented normalization rules.
- A canonical choice must trace `story node → claim → source segment`.
- `invented` and `counterfactual` content must be labeled in source files and UI metadata.
- A story must compile, terminate or intentionally loop within a declared limit, and expose no dangling asset/death/achievement IDs.
- The canonical route must reach a declared canonical ending without triggering a death outcome.
- Do not claim a publishable result when only the content draft has been generated; distinguish draft, validated, reviewed, and released.

## Resource routing

- Read [content-contract.md](references/content-contract.md) when creating or validating a content pack.
- Read [historical-integrity.md](references/historical-integrity.md) when classifying claims, handling conflicting editions, or reviewing historical dialogue.
- Read [ink-authoring.md](references/ink-authoring.md) when writing or debugging `.ink` files.
- Read [asset-guidelines.md](references/asset-guidelines.md) when planning visual/audio assets or replacing placeholders.
- Run project scripts under `scripts/` or the root `pnpm` commands instead of inventing ad hoc validation.
