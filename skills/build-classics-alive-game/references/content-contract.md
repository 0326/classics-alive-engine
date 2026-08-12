# Content contract

Every content pack has five layers:

1. `sources`: immutable or explicitly versioned source text and stable segment IDs.
2. `canon`: entities, chronology, places, events, and claims grounded in sources.
3. `design`: the human-readable adaptation brief and scene blueprint.
4. `stories`: Ink and machine-readable story metadata.
5. `learning` and `assets`: source notes, quizzes, visual/audio IDs, and provenance.

Use these IDs consistently:

```text
source-segment-id  = <classic>.<chapter>.<sequence>
claim-id           = claim.<subject>.<slug>
story-node-id      = <story>.<act>.<node>
asset-id           = <kind>.<slug>
```

At minimum, a `Claim` has `id`, `statement`, `certainty`, `sourceRefs`, and `usages`. A claim with `explicit`, `inferred`, or `contested` certainty must reference at least one source segment. `invented` and `counterfactual` claims must explain their dramatic purpose and must not be used to label a canonical route.
