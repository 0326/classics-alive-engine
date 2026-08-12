# Ink authoring profile

Use Ink for narrative flow and keep domain metadata in tags. Prefer readable knots and stitches, explicit gathers, and short branches that rejoin when their only purpose is flavor.

```ink
=== act_01_choice ===
#bg:market
#speaker:旁白
你来到市井。

* [忍让] #correct #evidence:claim.hanxin.kuaxia
    #speaker:旁白
    你低头走过。
    -> act_02
* [拔剑]
    #death:hanxin.kuaxia #evidence:claim.hanxin.kuaxia
    这一剑改变了你的一生。
    -> END
```

Keep the `#correct` and evidence tags on the choice line or the immediately produced line according to the project's parser contract. Never create a death knot containing only tags: it must emit at least one visible line. Run the Ink compiler and all-branch walker after every structural change.
