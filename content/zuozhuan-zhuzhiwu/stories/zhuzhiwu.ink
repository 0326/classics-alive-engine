-> act_01_court

=== act_01_court ===
#bg:background.zheng-wall-night
#show:character.zhuzhiwu
#show:character.zheng-duke
#speaker:旁白
#status:dramatized
城外的两支军队已合围郑国。佚之狐荐你去见秦伯；郑伯承认自己未曾早用你。原典记下了你的应允，没有替你填补此刻的情绪。

* [承认郑亡亦不利于己，夜赴秦营] #node:zhuzhiwu.act-01.accept-mission #correct #evidence:claim.zhuzhiwu.accept-mission #hint:zuozhuan.xigong30.005
    #speaker:烛之武
    #status:explicit
    你收下这句迟来的致歉。此行不是替郑伯抹去过失，而是去改变秦伯的计算。
    -> act_02_wall
* [拒绝出使，让郑伯另寻使者] #node:zhuzhiwu.act-01.refuse-mission #counterfactual:claim.counterfactual.refuse-mission
    -> outcome_refuse_mission

=== act_02_wall ===
#bg:background.zheng-wall-rope
#show:character.zhuzhiwu
#speaker:旁白
#status:dramatized
围城之下，城门不可能为使者打开。原典只用四字写下“夜缒而出”；这里把绳索、城垛与黑暗作为改编的体验连接。

* [待夜深，从城上缒下去见秦伯] #node:zhuzhiwu.act-02.descend-at-night #correct #evidence:claim.zhuzhiwu.night-descent #hint:zuozhuan.xigong30.006
    #speaker:旁白
    #status:explicit
    绳索擦过城砖。你落到城外，没有以郑国的恐惧作为开场。
    -> act_03_opening
* [趁白日出城，以示坦荡] #node:zhuzhiwu.act-02.descend-by-day #counterfactual:claim.counterfactual.daylight-descent
    -> outcome_daylight_descent

=== act_03_opening ===
#bg:background.qin-camp-night
#show:character.zhuzhiwu
#show:character.qin-duke
#speaker:旁白
#status:dramatized
秦伯面前，你先承认郑国已知将亡。问题不在于郑是否可怜，而在于灭郑是否真的有益于秦。

* [说明灭郑只会“陪邻”，使晋更厚、秦更薄] #node:zhuzhiwu.act-03.name-neighbor-cost #correct #evidence:claim.zhuzhiwu.neighbor-cost #hint:zuozhuan.xigong30.007
    #speaker:烛之武
    #status:explicit
    你不替郑国许下夸口的报偿，只点出越晋取郑很难，而晋的力量会因此增加。
    -> act_04_host
* [只求秦伯怜悯郑国百姓] #node:zhuzhiwu.act-03.only-plead #counterfactual:claim.counterfactual.only-plead
    -> outcome_only_plead

=== act_04_host ===
#bg:background.qin-camp-night
#show:character.zhuzhiwu
#show:character.qin-duke
#speaker:旁白
#status:dramatized
利害不是一句抽象的“不要灭郑”。你需要提出保留郑国对秦可见的用途；这是原典说辞中的下一层。

* [提出郑可为东道主，供秦国使者往来所需] #node:zhuzhiwu.act-04.offer-east-host #correct #evidence:claim.zhuzhiwu.east-host #hint:zuozhuan.xigong30.008
    #speaker:烛之武
    #status:explicit
    “行李之往来，共其乏困。”你把郑国的存续说成秦国东向交通的一项利益。
    -> act_05_promise
* [以郑军反击相威胁，逼秦即刻退兵] #node:zhuzhiwu.act-04.threaten-qin #counterfactual:claim.counterfactual.threaten-qin
    -> outcome_threaten_qin

=== act_05_promise ===
#bg:background.qin-camp-dawn
#show:character.zhuzhiwu
#show:character.qin-duke
#speaker:旁白
#status:dramatized
秦伯仍可把“东道主”视为小利。原典随后回望秦、晋旧事：受恩与失信被并置，但没有写成一段心理独白。

* [提及晋曾受秦赐，却朝济夕设版于焦、瑕] #node:zhuzhiwu.act-05.recall-jin-promise #correct #evidence:claim.jin.breaks-promise #hint:zuozhuan.xigong30.009
    #speaker:烛之武
    #status:explicit
    你提醒秦伯：这不是远方的猜测，而是他已经知道的晋国前例。
    -> act_06_risk
* [略过旧事，只重复郑国愿意臣服] #node:zhuzhiwu.act-05.repeat-submission #counterfactual:claim.counterfactual.only-plead
    -> outcome_only_plead

=== act_06_risk ===
#bg:background.qin-camp-dawn
#show:character.zhuzhiwu
#show:character.qin-duke
#speaker:旁白
#status:dramatized
最后的推理指向未来：晋若先向东扩张，西面的封界又会从哪里取得？这不是预言，而是原典中对利益冲突的论证。

* [说明阙秦只会利晋，请秦伯自行衡量] #node:zhuzhiwu.act-06.describe-future-risk #correct #evidence:claim.jin.future-expansion #hint:zuozhuan.xigong30.009
    #speaker:烛之武
    #status:explicit
    你以“唯君图之”收束，不替秦伯作决定。盟与不盟，仍须由他选择。
    -> act_07_return
* [承诺郑国将永远完全服从秦国] #node:zhuzhiwu.act-06.overpromise #counterfactual:claim.counterfactual.threaten-qin
    -> outcome_threaten_qin

=== act_07_return ===
#bg:background.armies-withdraw
#show:character.zhuzhiwu
#speaker:旁白
#status:dramatized
天色亮起，秦营的决定传回郑城。此处的行旅节奏为改编；结盟、留戍与撤军则须回到原典核对。

* [报告秦已与郑盟，秦军将留人戍守后撤离] #node:zhuzhiwu.act-07.report-alliance #correct #evidence:claim.qin.alliance-with-zheng #hint:zuozhuan.xigong30.010
    #speaker:旁白
    #status:explicit
    秦伯与郑人盟，留杞子、逢孙、杨孙戍守后撤军。子犯主张击秦，晋文公没有同意。
    -> ending_canon
* [把秦伯的犹疑当作盟约，催郑军出击] #node:zhuzhiwu.act-07.force-attack #counterfactual:claim.counterfactual.threaten-qin
    -> outcome_threaten_qin

=== ending_canon ===
#bg:background.armies-withdraw
#show:character.zhuzhiwu
#outcome:zuozhuan.zhuzhiwu.ending.canon
#achieve:achievement.zhuzhiwu.qin-withdraws
#evidence:claim.jin.withdraws
#speaker:旁白
#status:explicit
正史结局：秦与郑盟后撤军；晋文公以“不仁、不知、不武”为由拒击秦军，晋军也离开。原典证明的是撤军与理由，不要求玩家把这场说辞理解为唯一的道德答案。
-> END

=== outcome_refuse_mission ===
#bg:background.zheng-wall-night
#outcome:zuozhuan.zhuzhiwu.outcome.refuse-mission
#death:outcome.zhuzhiwu.refuse-mission
#counterfactual:claim.counterfactual.refuse-mission
#speaker:旁白
#status:counterfactual
假设分支：你拒绝出使。原典记载的是烛之武应允并说秦，本分支不构成郑国史实后续。
-> END

=== outcome_daylight_descent ===
#bg:background.zheng-wall-rope
#outcome:zuozhuan.zhuzhiwu.outcome.daylight-descent
#death:outcome.zhuzhiwu.daylight-descent
#counterfactual:claim.counterfactual.daylight-descent
#speaker:旁白
#status:counterfactual
假设分支：你在白日出城而未见秦伯。原典只说“夜缒而出”，这里的阻断是游戏改编，不是史料补写。
-> END

=== outcome_only_plead ===
#bg:background.qin-camp-night
#outcome:zuozhuan.zhuzhiwu.outcome.only-plead
#death:outcome.zhuzhiwu.only-plead
#counterfactual:claim.counterfactual.only-plead
#speaker:旁白
#status:counterfactual
假设分支：你没有展开原典中的利害推理。这个谈判结果为设计对照，不代表秦伯实际说过或做过什么。
-> END

=== outcome_threaten_qin ===
#bg:background.qin-camp-dawn
#outcome:zuozhuan.zhuzhiwu.outcome.threaten-qin
#death:outcome.zhuzhiwu.threaten-qin
#counterfactual:claim.counterfactual.threaten-qin
#speaker:旁白
#status:counterfactual
假设分支：你以威胁或虚构保证取代“唯君图之”的说辞，谈判失去原典所记的路径。这不是《左传》的历史结论。
-> END
