# Content contract

Every content pack has five layers:

1. `sources`: immutable or explicitly versioned source text and stable segment IDs.
2. `canon`: entities, chronology, places, events, and claims grounded in sources.
3. `design`: the human-readable adaptation brief and scene blueprint.
4. `stories`: Ink and machine-readable story metadata.
5. `learning` and `assets`: source notes, quizzes, visual/audio IDs, and provenance.

Every playable chapter also has `design/quality-targets.json`. It is a machine-readable promise, not an aspiration. It must set:

- playable duration range;
- minimum and maximum major choice nodes and canonical-route choices;
- minimum endings and counterfactual choices;
- minimum source segments, total claims, and source-grounded claims;
- complete canonical evidence coverage;
- whether historical human review is required before release.

Do not copy the demo values blindly. Choose a small, coherent vertical slice and set targets that fit its source material. The validator rejects a pack that fails its own declared target.

Use these IDs consistently:

```text
source-segment-id  = <classic>.<chapter>.<sequence>
claim-id           = claim.<subject>.<slug>
story-node-id      = <story>.<act>.<node>
asset-id           = <kind>.<slug>
```

At minimum, a `Claim` has `id`, `statement`, `certainty`, `sourceRefs`, and `usages`. A claim with `explicit`, `inferred`, or `contested` certainty must reference at least one source segment. `invented` and `counterfactual` claims must explain their dramatic purpose and must not be used to label a canonical route.

Every asset requires an ID, path, status, license, provenance, and brief. Character assets additionally require a concise `alt` field; do not make the player-facing UI infer names from a previous chapter's character IDs.
