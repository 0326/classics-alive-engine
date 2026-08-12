-> act_01_opening

=== act_01_opening ===
#bg:background.xiapixian-evening
#show:character.zhangliang
#show:character.elder
#speaker:旁白
#status:dramatized
下邳圯上，暮色刚压上水面。一位衣褐老父把鞋落在桥下，回头命你取来。原典只写下行动，不替你说明此刻的心绪。

* [下圯取履] #node:demo.act-01.take-shoe #correct #evidence:claim.zhangliang.take-shoe #hint:shiji.055.yishang.001
    #speaker:旁白
    #status:explicit
    你压下惊愕，走向桥下。鞋底沾着湿泥，河水在脚边发冷。
    -> act_01_shoe
* [拒绝命令，转身离开] #node:demo.act-01.refuse-shoe #counterfactual:claim.counterfactual.refuse-shoe
    -> outcome_refuse_shoe

=== act_01_shoe ===
#bg:background.xiapixian-evening
#show:character.zhangliang
#show:character.elder
#speaker:旁白
#status:dramatized
你取回鞋，老人却把脚伸来。原文记下张良“长跪履之”；这一刻的犹疑，是给玩家看清正史与选择边界的停顿。

* [长跪为老人履之] #node:demo.act-01.kneel-shoe #correct #evidence:claim.zhangliang.kneel-shoe #hint:shiji.055.yishang.003
    #speaker:旁白
    #status:explicit
    你俯身为老人穿好鞋。他笑着离开，走出一里多又折返回来。
    -> act_01_appointment
* [把鞋放下，不再上前] #node:demo.act-01.stop-at-shoe #counterfactual:claim.counterfactual.refuse-shoe
    -> outcome_refuse_shoe

=== act_01_appointment ===
#bg:background.xiapixian-dawn
#show:character.elder
#speaker:旁白
#status:explicit
老人说：“孺子可教矣。”又约你五日后平明在此相会。你看着他的背影没入桥外晨雾。

* [跪而应诺，记下五日之约] #node:demo.act-01.accept-appointment #correct #evidence:claim.elder.appointment #hint:shiji.055.yishang.004
    #speaker:旁白
    #status:explicit
    你答应赴约。五日像一段需要自己安排的路程：睡眠、戒备和迟疑，都不替你作决定。
    -> act_02_first
* [不再追问，任约定随风散去] #node:demo.act-01.leave-appointment #counterfactual:claim.counterfactual.leave-appointment
    -> outcome_leave_appointment

=== act_02_first ===
#bg:background.xiapixian-dawn
#show:character.zhangliang
#show:character.elder
#speaker:旁白
#status:dramatized
第五日平明，你赶到圯上。老人已经等在那里，神色严厉。原典记下了这次“后”，也记下他要你五日后更早来。

* [承认来迟，记住下一次须更早] #node:demo.act-02.first-appointment #correct #evidence:claim.zhangliang.first-late #hint:shiji.055.yishang.005
    #speaker:旁白
    #status:explicit
    老人责你失约，转身离去，只留下“五日早会”。这不是通关奖励，而是又一道需要兑现的约定。
    -> act_02_second
* [认为要求无理，不再赴约] #node:demo.act-02.stop-trying-first #counterfactual:claim.counterfactual.stop-trying
    -> outcome_stop_trying

=== act_02_second ===
#bg:background.xiapixian-pre-dawn
#show:character.zhangliang
#show:character.elder
#speaker:旁白
#status:dramatized
第二个五日后，鸡鸣时你已到桥上；老人还是比你更早。原典没有把这写成道德考试，只写下又一次迟到与又一次要求。

* [接受第二次责语，决定夜未半即往] #node:demo.act-02.second-appointment #correct #evidence:claim.zhangliang.second-late #hint:shiji.055.yishang.006
    #speaker:旁白
    #status:explicit
    老人离去。你不再把“更早”理解成模糊承诺，而将它落实为第三次赴约的时刻。
    -> act_03_third
* [带着不满离开，不再尝试] #node:demo.act-02.stop-trying-second #counterfactual:claim.counterfactual.stop-trying
    -> outcome_stop_trying

=== act_03_third ===
#bg:background.xiapixian-night
#show:character.zhangliang
#speaker:旁白
#status:dramatized
第三个五日的夜尚未过半。桥、河、风都还在黑暗里；你必须决定是否现在动身。此处的环境描写是改编，为的是让“夜未半往”的文本事实可被体验。

* [夜未半即抵达圯上] #node:demo.act-03.third-appointment #correct #evidence:claim.zhangliang.before-midnight #hint:shiji.055.yishang.007
    #speaker:旁白
    #status:explicit
    过了一会儿，老人也来了。他终于露出笑意：“当如是。”
    -> act_03_book
* [等到天将明再去] #node:demo.act-03.wait-for-dawn #counterfactual:claim.counterfactual.stop-trying
    -> outcome_stop_trying

=== act_03_book ===
#bg:background.xiapixian-dawn
#show:character.elder
#speaker:旁白
#status:explicit
老人取出一编书，说读它可为王者师，并留下“黄石即我”的话后离去。你握着书卷，知道这不是结局，而是原典后续的开端。

* [收下书卷，次日辨读并常习诵之] #node:demo.act-03.receive-book #correct #evidence:claim.elder.give-book #hint:shiji.055.yishang.008
    #speaker:旁白
    #status:explicit
    次日你认出它是《太公兵法》，从此常常习诵。圯上的相遇在这里回到《史记》的叙述。
    -> ending_canon
* [收下书卷，却决定不再阅读] #node:demo.act-03.reject-book #counterfactual:claim.counterfactual.reject-book
    -> outcome_reject_book

=== ending_canon ===
#bg:background.xiapixian-morning
#show:character.zhangliang
#outcome:demo.ending.canon
#achieve:achievement.demo.yishang-endure
#evidence:claim.zhangliang.study-book
#speaker:旁白
#status:explicit
正史结局：你完成了《史记》所记的圯上受履、赴约与习诵之路。原文只能证明张良的行动；它不要求玩家把克制当作唯一的道德答案。
-> END

=== outcome_refuse_shoe ===
#bg:background.xiapixian-evening
#outcome:demo.outcome.refuse-shoe
#death:outcome.demo.refuse-shoe
#counterfactual:claim.counterfactual.refuse-shoe
#speaker:旁白
#status:counterfactual
假设分支：你拒绝下圯取履。故事没有进入《史记》记录的后续，这不是史实结论。
-> END

=== outcome_leave_appointment ===
#bg:background.xiapixian-dawn
#outcome:demo.outcome.leave-appointment
#death:outcome.demo.leave-appointment
#counterfactual:claim.counterfactual.leave-appointment
#speaker:旁白
#status:counterfactual
假设分支：你没有赴五日之约。原典没有记载这一选择，因此它不能作为张良的正史路径。
-> END

=== outcome_stop_trying ===
#bg:background.xiapixian-pre-dawn
#outcome:demo.outcome.stop-trying
#death:outcome.demo.stop-trying
#counterfactual:claim.counterfactual.stop-trying
#speaker:旁白
#status:counterfactual
假设分支：你在反复迟到后停止赴约。这里呈现的是改编的离场，不是原典的评价。
-> END

=== outcome_reject_book ===
#bg:background.xiapixian-morning
#outcome:demo.outcome.reject-book
#death:outcome.demo.reject-book
#counterfactual:claim.counterfactual.reject-book
#speaker:旁白
#status:counterfactual
假设分支：你收下书却不再研读，因此没有走向原典所记“常习诵读”的结局。
-> END
