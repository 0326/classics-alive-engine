# Autonomous quality loop

Treat `npm run playability:gate` as the sole technical completion signal. It writes:

- `reports/<pack-id>/quality-gate.json`: content structure, Ink traversal, canonical route, compilation, and content-report results;
- `reports/<pack-id>/completion.json`: static checks, regression tests, production builds, budget, browser playthrough, and deployment dry-run results.

On failure, use only `repairInputs` and the referenced source files to make the smallest correct repair. Then run the entire gate again. Never edit `generated/` or reports to simulate success.

Keep browser QA content-pack neutral. Read the compiled active content and Ink source to discover its canonical choices, at least one counterfactual choice, the canonical achievement, and source-panel evidence. A test that names a prior chapter's title, dialogue, source note, or choice is a regression-test bug, not evidence of a new chapter's quality.

Run one desktop visual check at 1280×720 and one narrow check at 390×844. On desktop, the first dialogue card and a choice must fit in the viewport; on narrow screens, no horizontal overflow is allowed. Character images must render content-pack-supplied alternative text rather than a generic runtime fallback.

Use this state model:

| State | Meaning | Authority |
| --- | --- | --- |
| `draft` | Source or story exists; technical gate has not passed. | Agent or editor |
| `validated` | The full technical gate passed. | Gate report only |
| `reviewed` | Required historical/cultural/narrative review is recorded. | Named human reviewer |
| `ready-for-release` | Technical gate and all configured human gates passed. | Gate report plus human records |

Stop after three failed repair passes. Report the stable failure and request the missing authority or material; do not lower `quality-targets.json` just to convert a failure into success.

For fixture and isolated-pack checks, set `CAGE_REPORT_DIR` and `CAGE_GENERATED_DIR` to a temporary directory. Test runs must not overwrite `generated/active`, which remains the selected player preview.
