/*
  BBTI 数据区
  1. 前端静态生成 200 道题库
  2. 16 种新编码人格：SGJM / SGJW / SGYM / SGYW ...
  3. 每种人格 5 套长文话术
  4. 推荐池：目的地、装备、穿搭、朋友圈文案、塔罗问题、OOTD 参数
*/

(function () {
  const WEIGHT_POOL = [1, 1.2, 1.4, 1.6, 1.8, 2];

  function replaceCtx(text, ctx) {
    return String(text).replaceAll("{ctx}", ctx);
  }

  function createAxisQuestions(axis, prefix, leftCode, rightCode, contexts, templates) {
    const questions = [];
    let index = 1;

    contexts.forEach((ctx, ctxIndex) => {
      templates.forEach((tpl, tplIndex) => {
        const weight = tpl.weight || WEIGHT_POOL[(ctxIndex + tplIndex) % WEIGHT_POOL.length];

        questions.push({
          id: `${prefix}_${String(index).padStart(3, "0")}`,
          axis,
          text: replaceCtx(tpl.text, ctx),
          weight,
          options: [
            {
              id: "A",
              text: replaceCtx(tpl.left, ctx),
              code: leftCode,
              weight
            },
            {
              id: "B",
              text: replaceCtx(tpl.right, ctx),
              code: rightCode,
              weight
            }
          ]
        });

        index += 1;
      });
    });

    return questions;
  }

  /*
    题库生成说明：
    每个维度：
    - 5 个旅行场景上下文
    - 10 个情景题模板
    - 共 50 道题

    四个维度共：
    - 50 × 4 = 200 道题

    每次测试：
    - decision 抽 8
    - social 抽 8
    - consume 抽 7
    - explore 抽 7
    - 合计 30 道
  */

  const decisionContexts = [
    "突然多出来的三天假期",
    "去一个从没去过的小众城市",
    "朋友临时约你周末短途旅行",
    "天气预报和原计划不太一致",
    "你准备参加一次高海拔或远途旅行"
  ];

  const socialContexts = [
    "一次周末自驾旅行",
    "去热门景区拍照打卡",
    "参加露营或徒步活动",
    "去陌生城市 citywalk",
    "节假日安排一次长途旅行"
  ];

  const consumeContexts = [
    "订酒店和交通时",
    "选择旅行餐厅时",
    "准备旅行装备时",
    "规划旅行预算时",
    "面对一个很想体验但价格不低的项目时"
  ];

  const exploreContexts = [
    "目的地有成熟路线和小众路线可选",
    "看到一条没有太多攻略的路线",
    "同伴提议去更野一点的地方",
    "旅行中出现临时岔路或未知地点",
    "你在选择下一次旅行主题时"
  ];

  const decisionTemplates = [
    {
      text: "面对{ctx}，你第一反应更接近哪一种？",
      left: "先出发再说，很多细节可以路上慢慢决定。",
      right: "先查清楚路线、住宿、交通和预算，再决定是否出发。",
      weight: 1.6
    },
    {
      text: "如果{ctx}时计划突然被打乱，你会？",
      left: "觉得也不错，变化本身可能就是旅行的惊喜。",
      right: "会先重新整理方案，尽量把不确定因素降到最低。",
      weight: 1.8
    },
    {
      text: "在{ctx}之前，你更习惯？",
      left: "只确定大方向，不把每天安排得太死。",
      right: "提前列好行程表，最好每天几点做什么都清楚。",
      weight: 1.4
    },
    {
      text: "如果朋友问你{ctx}怎么安排，你会更想说？",
      left: "先定个地方，到了再看心情玩。",
      right: "我先做个攻略，把路线和时间排一下。",
      weight: 1.5
    },
    {
      text: "当你想到{ctx}，哪种状态会让你更安心？",
      left: "行程有弹性，可以临时改变。",
      right: "大部分事情提前确认，不容易踩雷。",
      weight: 1.7
    },
    {
      text: "如果{ctx}过程中突然看到一个很感兴趣的地方，你会？",
      left: "立刻调整路线，灵感来了就要抓住。",
      right: "先判断会不会影响后续安排，再决定要不要去。",
      weight: 1.6
    },
    {
      text: "对你来说，{ctx}最重要的是？",
      left: "自由感、松弛感和当下的兴致。",
      right: "掌控感、确定性和整体效率。",
      weight: 1.3
    },
    {
      text: "如果{ctx}只能选一种准备方式，你更倾向？",
      left: "轻攻略，只收藏几个想去的点。",
      right: "重攻略，交通、时间、门票都提前确认。",
      weight: 1.4
    },
    {
      text: "在{ctx}里，你最不喜欢哪种感觉？",
      left: "被时间表追着跑，每一步都被安排好。",
      right: "不知道下一步去哪，临时找信息很被动。",
      weight: 1.5
    },
    {
      text: "如果{ctx}出现两个选择，你更容易选？",
      left: "那个听起来更有新鲜感、当下更想去的。",
      right: "那个更合理、更稳妥、更符合原计划的。",
      weight: 2
    }
  ];

  const socialTemplates = [
    {
      text: "面对{ctx}，你更期待哪种氛围？",
      left: "一群人热热闹闹，有人分享、有人拍照、有人接梗。",
      right: "人少一点，最好能保留自己的节奏和安静空间。",
      weight: 1.6
    },
    {
      text: "如果{ctx}时需要选择同行方式，你会？",
      left: "更愿意约朋友一起，路上有互动才更有意思。",
      right: "更愿意独自或小范围出行，不想迁就太多人。",
      weight: 1.8
    },
    {
      text: "在{ctx}中，你更容易被什么打动？",
      left: "大家一起发现好玩的地方，现场气氛很快乐。",
      right: "一个人慢慢看风景，情绪被安静地接住。",
      weight: 1.5
    },
    {
      text: "如果{ctx}时同行人意见不一致，你会更在意？",
      left: "团队氛围别冷掉，大家开心最重要。",
      right: "自己的感受不要被过度牺牲，边界也很重要。",
      weight: 1.7
    },
    {
      text: "你想象中的{ctx}更像？",
      left: "朋友局、拍照局、聊天局，越热闹越有记忆点。",
      right: "散心局、放空局、独处局，越安静越能恢复能量。",
      weight: 1.4
    },
    {
      text: "当{ctx}结束后，你更希望记住？",
      left: "和大家一起经历的笑点、合照和共同回忆。",
      right: "自己在某个瞬间突然放松下来的感觉。",
      weight: 1.3
    },
    {
      text: "如果有人邀请你参加{ctx}，但成员不太熟，你会？",
      left: "愿意试试，说不定能认识同频的新朋友。",
      right: "会犹豫，不熟的人太多会消耗状态。",
      weight: 1.6
    },
    {
      text: "在{ctx}时，你更常扮演？",
      left: "气氛参与者，愿意聊天、拍照、分享发现。",
      right: "节奏观察者，更多时候想安静体验和独自消化。",
      weight: 1.5
    },
    {
      text: "如果{ctx}需要住同一间民宿或露营营地，你会？",
      left: "觉得很有氛围，晚上聊天会很快乐。",
      right: "希望有独立空间，不想一直处在社交状态。",
      weight: 1.8
    },
    {
      text: "对你来说，{ctx}最好的同行状态是？",
      left: "同频的人一起热闹出发，快乐会被放大。",
      right: "彼此尊重节奏，不说话也不尴尬。",
      weight: 2
    }
  ];

  const consumeTemplates = [
    {
      text: "{ctx}，你更容易怎么选？",
      left: "体验感优先，贵一点但舒服、有质感也值得。",
      right: "性价比优先，钱要花得清楚，不为虚高溢价买单。",
      weight: 1.6
    },
    {
      text: "如果{ctx}遇到两个方案，你更倾向？",
      left: "选择品质更好、服务更稳定、体验更完整的那个。",
      right: "选择够用就好、价格合理、实用不浪费的那个。",
      weight: 1.7
    },
    {
      text: "你对{ctx}的态度更接近？",
      left: "旅行本来就是奖励自己，该享受时不要太委屈。",
      right: "旅行不一定要花很多钱，舒服和划算可以兼得。",
      weight: 1.5
    },
    {
      text: "如果{ctx}预算超出预期，你会？",
      left: "只要足够喜欢，愿意为记忆点和品质加预算。",
      right: "会重新比较，尽量找到更合理的替代方案。",
      weight: 1.8
    },
    {
      text: "在{ctx}这件事上，你最不能接受？",
      left: "为了省钱导致体验明显变差、休息不好或拍照不好看。",
      right: "为了所谓精致花冤枉钱，最后并没有实际价值。",
      weight: 1.6
    },
    {
      text: "如果朋友推荐一个很火但偏贵的选择，适用于{ctx}，你会？",
      left: "愿意试试看，热门可能有它值得体验的地方。",
      right: "先看真实评价和预算，不会盲目跟风。",
      weight: 1.4
    },
    {
      text: "{ctx}时，你更看重？",
      left: "舒适度、审美、服务和整体情绪价值。",
      right: "实用性、耐用度、价格和是否真的需要。",
      weight: 1.5
    },
    {
      text: "如果{ctx}可以升级体验，你会？",
      left: "在关键环节升级，比如住宿、餐厅、拍照或交通。",
      right: "除非必要，否则保持基础配置，把钱留给更重要的地方。",
      weight: 1.7
    },
    {
      text: "你更认同哪句话？放在{ctx}里尤其明显。",
      left: "旅行要对自己好一点，美好的体验值得花钱。",
      right: "旅行不靠消费堆出来，聪明规划也能很快乐。",
      weight: 1.8
    },
    {
      text: "当{ctx}时，你的底层逻辑更像？",
      left: "把旅途过得有质感，留下漂亮且舒服的记忆。",
      right: "用更少成本完成更高体验，少花冤枉钱。",
      weight: 2
    }
  ];

  const exploreTemplates = [
    {
      text: "当{ctx}，你更可能选择？",
      left: "更少人、更未知、更有探索感的那条路。",
      right: "更成熟、更安全、更不容易出错的那条路。",
      weight: 1.7
    },
    {
      text: "如果{ctx}，你的第一反应是？",
      left: "有点兴奋，未知感让旅行更有生命力。",
      right: "先谨慎评估，安全和确定性更重要。",
      weight: 1.8
    },
    {
      text: "{ctx}时，你更容易被什么吸引？",
      left: "荒野、山海、秘境、冷门机位、非标准体验。",
      right: "成熟景区、舒适路线、完善设施、稳定体验。",
      weight: 1.5
    },
    {
      text: "面对{ctx}，你更不想遇到？",
      left: "路线太普通，感觉像复制粘贴式打卡。",
      right: "风险太多，交通、天气、设施都不确定。",
      weight: 1.6
    },
    {
      text: "如果{ctx}需要多走路、多转车或条件一般，你会？",
      left: "只要风景足够特别，可以接受折腾。",
      right: "如果过程太累太不稳，宁愿换轻松路线。",
      weight: 1.7
    },
    {
      text: "你心里的{ctx}更理想的是？",
      left: "有一点冒险感，回来后会觉得自己真的经历了什么。",
      right: "舒适、安全、顺利，整个过程不要太狼狈。",
      weight: 1.4
    },
    {
      text: "当朋友说{ctx}有点野，你会？",
      left: "更感兴趣，想知道到底有多野、多特别。",
      right: "更谨慎，先看有没有安全保障和清晰路线。",
      weight: 1.8
    },
    {
      text: "在{ctx}的选择里，你更看重？",
      left: "独特性、稀缺感、故事感和探索后的成就感。",
      right: "稳定性、便利性、舒适度和风险可控。",
      weight: 1.6
    },
    {
      text: "如果{ctx}只能二选一，你会选？",
      left: "小众但可能有惊喜的路线。",
      right: "经典但基本不会踩雷的路线。",
      weight: 1.5
    },
    {
      text: "对你来说，{ctx}最重要的底色是？",
      left: "去到未知里，看看自己没见过的世界。",
      right: "在安全舒适中，稳定获得放松和好心情。",
      weight: 2
    }
  ];

  const decisionQuestions = createAxisQuestions(
    "decision",
    "decision",
    "S",
    "P",
    decisionContexts,
    decisionTemplates
  );

  const socialQuestions = createAxisQuestions(
    "social",
    "social",
    "G",
    "D",
    socialContexts,
    socialTemplates
  );

  const consumeQuestions = createAxisQuestions(
    "consume",
    "consume",
    "J",
    "Y",
    consumeContexts,
    consumeTemplates
  );

  const exploreQuestions = createAxisQuestions(
    "explore",
    "explore",
    "M",
    "W",
    exploreContexts,
    exploreTemplates
  );

  window.BBTI_QUESTION_BANK = [
    ...decisionQuestions,
    ...socialQuestions,
    ...consumeQuestions,
    ...exploreQuestions
  ];

  const dimensionText = {
    S: "随性",
    P: "规划",
    G: "群居",
    D: "独处",
    J: "精致",
    Y: "简约",
    M: "冒险",
    W: "安稳"
  };

  const profileSeed = {
    SGJM: {
      name: "热烈探险家",
      tags: ["热爱热闹", "临时起意", "追求品质", "大胆探索"],
      core: "你像一团会移动的火，喜欢和同频的人一起奔赴山海，也愿意为了真正有记忆点的体验投入时间、金钱和热情。",
      strength: "你擅长把普通旅途变成高能故事，能带动同行氛围，也能在未知路线里发现惊喜。",
      caution: "你需要注意别让一时兴起冲淡风险意识，交通、天气、住宿和安全预案至少要保留一条底线。",
      destinations: ["川西小环线", "小众海岛", "高海拔星空露营", "音乐节旅行", "荒野徒步", "海边公路", "沙漠营地", "火山岛"],
      gears: ["轻量冲锋衣", "运动相机", "防滑徒步鞋", "便携充电宝", "墨镜", "防晒喷雾", "户外头灯", "小型急救包"],
      outfits: ["山野机能风", "亮色冲锋衣", "户外运动鞋", "撞色叠穿", "适合拍照的防晒穿搭", "棒球帽和运动墨镜"],
      moments: ["风一吹，计划就散了，但快乐刚刚好。", "和同频的人出发，连未知都变得闪闪发光。", "今天不走寻常路，去山海里捡一点自由。"],
      tarotQuestions: ["我下一次大胆出发会遇到什么机会？", "这段未知旅程会带给我什么成长？", "我近期适合奔赴一个新的目的地吗？"],
      ootd: { style: "舒适耐走", scene: "小众山野旅行", extra: "偏山野机能风，适合拍照、徒步、防晒，颜色可以有亮色点缀。" }
    },
    SGJW: {
      name: "温柔享乐家",
      tags: ["偏爱热闹", "随性生活", "注重品质", "稳妥舒适"],
      core: "你的旅行不一定要刺激，但一定要舒服、好看、有陪伴感。你喜欢和朋友一起慢慢玩，把旅途过成温柔日常。",
      strength: "你很会享受旅行里的氛围感，也能让同行关系变得轻松自然，适合组织舒适型小团。",
      caution: "你容易因为追求舒适而回避变化，也可能被热门推荐牵着走，建议给旅途留一点小惊喜。",
      destinations: ["阿那亚", "大理洱海", "三亚海边", "苏州园林", "温泉度假村", "海边民宿", "城市周边度假区", "轻松古镇"],
      gears: ["舒适拖鞋", "轻便托特包", "防晒帽", "补水喷雾", "一次性浴巾", "拍照支架", "香氛小样", "便携小风扇"],
      outfits: ["法式度假风", "浅色针织开衫", "舒适连衣裙", "低饱和套装", "海边松弛感穿搭", "轻熟温柔风"],
      moments: ["不用赶路，和喜欢的人慢慢浪费时间。", "今天的风景很温柔，刚好适合把生活放慢。", "把旅途过成日常，也把日常过成礼物。"],
      tarotQuestions: ["我近期会在哪段关系或旅途中获得温柔能量？", "下一次轻松旅行会带给我什么疗愈？", "我该如何让生活和旅行更舒适稳定？"],
      ootd: { style: "出片优先", scene: "海边度假或城市慢游", extra: "偏温柔度假风，舒适、有质感、适合拍照，不要太硬核。" }
    },
    SGYM: {
      name: "自由流浪者",
      tags: ["结伴撒欢", "随性自由", "性价比优先", "热爱探险"],
      core: "你不需要太昂贵的旅行来证明快乐。朋友、自由、风景和一点冒险感，就足够让你出发。",
      strength: "你适合低成本高体验的路线，能在预算有限的情况下玩得很野、很开心、很有生命力。",
      caution: "你容易低估装备、交通和安全成本。省钱很好，但关键节点别省，比如鞋、保暖和返程交通。",
      destinations: ["武功山", "贵州小众村寨", "平潭岛", "露营营地", "城市周边野线", "免费公园徒步", "冷门海岸线", "青年旅舍路线"],
      gears: ["轻便背包", "速干衣", "登山杖", "防晒袖套", "水壶", "压缩毛巾", "便携雨衣", "低成本露营灯"],
      outfits: ["轻户外休闲风", "速干 T 恤", "工装裤", "平价机能风", "耐脏耐走穿搭", "防晒帽搭配"],
      moments: ["花最少的钱，吹最自由的风。", "人间不止有攻略，还有说走就走的快乐。", "路不贵，风景也不贵，自由才珍贵。"],
      tarotQuestions: ["我下一次低成本旅行会收获什么？", "我近期适合和朋友一起探索哪里？", "这段自由出发会让我看见什么新可能？"],
      ootd: { style: "舒适耐走", scene: "低成本户外旅行", extra: "偏轻户外、平价实用、耐走耐脏，适合徒步和拍照。" }
    },
    SGYW: {
      name: "佛系休闲客",
      tags: ["热爱群居", "佛系随性", "节俭出行", "稳妥保守"],
      core: "你要的旅行不是折腾，而是大家一起放松。省心、省钱、安全、舒服，就是你的快乐公式。",
      strength: "你很适合亲友短途、城市周边、轻松慢游，既能照顾预算，也能照顾团队舒适度。",
      caution: "你可能因为太佛系而错过一些真正值得体验的内容，偶尔给自己安排一个小亮点，会让旅途更有记忆。",
      destinations: ["城市周边古镇", "近郊公园", "轻松海边", "温泉小镇", "博物馆路线", "短途自驾", "成熟景区", "亲友度假村"],
      gears: ["双肩包", "舒适运动鞋", "保温杯", "折叠伞", "零食包", "基础药品", "充电宝", "轻薄外套"],
      outfits: ["基础休闲风", "宽松卫衣", "舒适运动鞋", "低饱和穿搭", "日常可穿", "轻便外套"],
      moments: ["不赶路，不折腾，和舒服的人一起就很好。", "省钱省心，也能拥有很好的风景。", "今天的计划是：慢慢走，慢慢开心。"],
      tarotQuestions: ["我近期适合怎样放松自己？", "下一段安稳旅途会给我什么能量？", "我和朋友的轻松出行会顺利吗？"],
      ootd: { style: "舒适耐走", scene: "城市周边休闲游", extra: "舒适、轻便、日常可穿，适合慢走和亲友出行。" }
    },
    SDJM: {
      name: "孤高浪漫家",
      tags: ["偏爱独行", "临时出发", "追求质感", "勇于探险"],
      core: "你适合一个人去看辽阔的风景。你不喜欢被打扰，也不愿意为了将就别人牺牲旅途质感。",
      strength: "你有很强的独处审美和探索能力，能把一个人的旅行过得有质感、有故事、有精神能量。",
      caution: "你需要注意安全报备和路线确认。独行可以浪漫，但不代表要把所有风险都一个人扛。",
      destinations: ["独行海岛", "山野民宿", "高海拔观景地", "小众摄影路线", "艺术村落", "荒野公路", "静谧湖泊", "冷门古城"],
      gears: ["定位器或共享位置", "高品质背包", "降噪耳机", "运动相机", "轻量三脚架", "防风外套", "急救包", "备用电源"],
      outfits: ["高级户外风", "黑白灰机能风", "质感冲锋衣", "摄影感穿搭", "长线条外套", "冷感配色"],
      moments: ["一个人也可以把山海看得很盛大。", "不必合群，风会替我说话。", "独自奔赴远方，是我和世界的私语。"],
      tarotQuestions: ["我一个人旅行会获得什么内在指引？", "我近期适合独自出发吗？", "这段独行会让我看清什么？"],
      ootd: { style: "高级简约", scene: "独行小众旅行", extra: "高级户外感，适合独行拍照，质感、耐走、防风。" }
    },
    SDJW: {
      name: "静谧治愈者",
      tags: ["安静独处", "佛系出行", "注重质感", "稳妥疗愈"],
      core: "你把旅行当作一种恢复能量的方式。你不急着热闹，也不急着征服世界，只想在舒服的地方慢慢把自己安顿好。",
      strength: "你擅长找到安静、舒适、有品质的疗愈空间，适合独处散心、慢游和身心修复。",
      caution: "你有时会过度回避社交或变化。适度打开一点外界连接，可能会遇到意外的温柔。",
      destinations: ["安静海边民宿", "温泉酒店", "美术馆城市", "小众咖啡街区", "园林景区", "湖边度假区", "疗愈民宿", "慢节奏古城"],
      gears: ["香薰小样", "舒适睡衣", "降噪耳机", "阅读书", "保温杯", "护肤小样", "眼罩", "轻便外套"],
      outfits: ["高级简约风", "低饱和针织", "舒适长裙", "浅色系穿搭", "松弛感外套", "质感平底鞋"],
      moments: ["人间很吵，我在风景里慢慢安静。", "一个人慢慢走，也是一种被生活抱住。", "今天不追赶，只修复自己。"],
      tarotQuestions: ["我近期适合如何疗愈自己？", "独处会带给我怎样的答案？", "我下一段安静旅途会收获什么？"],
      ootd: { style: "高级简约", scene: "安静治愈慢游", extra: "低饱和、舒适、有质感，适合独处散心和拍照。" }
    },
    SDYM: {
      name: "山野独行客",
      tags: ["孤身独行", "随心所欲", "低成本出行", "热爱山野"],
      core: "你喜欢轻装上阵，一个人走进山野。你不需要太多消费，也不需要太多陪伴，自由本身就是奖励。",
      strength: "你适合徒步、穷游、自然探索和独立路线，抗干扰能力强，也很能在简单条件里获得满足。",
      caution: "你要特别重视安全、补给和天气。越是独行和低成本，越不能忽略基础装备。",
      destinations: ["徒步山线", "国家森林公园", "冷门峡谷", "青年旅舍城市", "低成本海岛", "草原徒步", "山野露营", "公路搭车路线"],
      gears: ["徒步鞋", "速干衣", "登山杖", "头灯", "急救包", "离线地图", "雨衣", "能量棒"],
      outfits: ["硬核轻户外", "速干工装风", "耐磨长裤", "低成本机能风", "防晒头巾", "徒步鞋穿搭"],
      moments: ["一个人走很远的路，也把自己找回来。", "山野不问来处，风只管自由。", "轻装赴山海，万事都从简。"],
      tarotQuestions: ["我下一次独自探索需要注意什么？", "山野之行会带给我什么力量？", "我近期适合放下什么负担？"],
      ootd: { style: "舒适耐走", scene: "独行徒步山野", extra: "硬核实用，轻便、防晒、耐磨，适合徒步和低成本旅行。" }
    },
    SDYW: {
      name: "慵懒散心人",
      tags: ["安静独处", "佛系摆烂", "理性消费", "稳妥出行"],
      core: "你旅行的目的很简单：换个地方呼吸。你不想赶路，不想花太多钱，也不想被复杂计划消耗。",
      strength: "你很懂得用低成本方式恢复生活状态，适合一个人散步、看展、逛公园、短途放空。",
      caution: "你可能因为过度求稳而让旅途缺少记忆点。给自己安排一个小小的期待，会让散心更有效。",
      destinations: ["城市公园", "书店路线", "免费展览", "近郊湖边", "安静古镇", "成熟景区慢游", "城市咖啡街区", "短途散心地"],
      gears: ["帆布包", "舒适鞋", "水杯", "耳机", "纸巾湿巾", "轻薄外套", "小零食", "充电宝"],
      outfits: ["极简休闲风", "宽松衬衫", "舒适长裤", "浅色基础款", "平底鞋", "低饱和穿搭"],
      moments: ["不远行也没关系，今天只是想换个地方发呆。", "慢慢走，慢慢把自己还给自己。", "松弛一点，风景就会靠近一点。"],
      tarotQuestions: ["我近期适合如何放松和整理自己？", "这段独处会给我什么提醒？", "我接下来需要降低哪部分消耗？"],
      ootd: { style: "舒适耐走", scene: "城市散心慢游", extra: "极简舒适，适合一个人散心、看展、走路，不要复杂。" }
    },
    PGJM: {
      name: "攻略探索家",
      tags: ["严谨攻略", "结伴出行", "品质消费", "热衷探索"],
      core: "你不是盲目冒险的人。你会认真研究路线、筛选伙伴和控制细节，然后把小众探索做成高质量体验。",
      strength: "你是很强的旅行组织者，能把冒险路线做得有准备、有品质、有安全感。",
      caution: "你需要避免把行程排得太满，给未知留一点空间，惊喜才有机会发生。",
      destinations: ["川西深度路线", "新疆自驾", "海外小众城市", "高品质露营", "精品徒步路线", "小众海岛", "摄影采风路线", "山海自驾"],
      gears: ["专业冲锋衣", "登山鞋", "摄影设备", "备用电池", "攻略清单", "急救包", "保温杯", "多功能背包"],
      outfits: ["高品质机能风", "户外层次穿搭", "摄影感冲锋衣", "耐走但出片", "质感运动风", "城市户外混搭"],
      moments: ["把攻略做到极致，再去和未知见面。", "有准备地冒险，才是我的浪漫。", "山海很野，但我有计划。"],
      tarotQuestions: ["我下一段精心准备的旅途会顺利吗？", "这次探索最需要提前注意什么？", "我近期适合推进哪条旅行计划？"],
      ootd: { style: "出片优先", scene: "高品质户外探索", extra: "高品质机能风，适合拍照、徒步、自驾和小众路线。" }
    },
    PGJW: {
      name: "完美出行官",
      tags: ["精细规划", "热闹结伴", "品质出行", "稳妥不踩雷"],
      core: "你适合做团队里的出行官。你在意舒适、效率、品质和安全，也希望大家都玩得开心。",
      strength: "你能把旅行安排得很稳，很少踩雷，适合亲友游、情侣游、多人品质游。",
      caution: "你可能会因为太想完美而累到自己。不是所有细节都必须由你负责。",
      destinations: ["高品质城市游", "成熟海岛度假", "迪士尼", "温泉酒店", "热门景区精品路线", "亲友度假村", "高评分民宿", "精致古城游"],
      gears: ["行程表", "证件收纳包", "拍照支架", "舒适鞋", "备用药品", "充电宝", "防晒用品", "一次性用品包"],
      outfits: ["精致城市旅行风", "舒适套装", "拍照友好连衣裙", "质感外套", "低跟鞋", "轻熟出片风"],
      moments: ["不踩雷，是我给旅途最大的安全感。", "安排妥当之后，快乐才会稳稳发生。", "把日子规划好，也把风景认真收藏。"],
      tarotQuestions: ["我近期的出行计划会顺利推进吗？", "我在团队关系中需要注意什么？", "下一次旅行会带来怎样的稳定收获？"],
      ootd: { style: "出片优先", scene: "品质城市旅行", extra: "精致、舒适、适合拍照，适合成熟景区和城市打卡。" }
    },
    PGYM: {
      name: "省钱探险官",
      tags: ["精准规划", "多人同行", "理性消费", "小众探险"],
      core: "你擅长把钱花在刀刃上。你会认真做攻略，和朋友一起用合理预算探索更有意思的风景。",
      strength: "你是性价比和探索欲兼具的人，能找到冷门但值得去的地方，也能帮团队避开冤枉钱。",
      caution: "你需要注意别为了省钱牺牲安全和休息。探险路线里，基础装备和保险不能省。",
      destinations: ["免费徒步路线", "冷门古村", "低成本露营", "公共交通可达小众地", "青年旅舍路线", "山野徒步", "非热门海岛", "周边自驾野线"],
      gears: ["平价冲锋衣", "徒步鞋", "折叠雨衣", "压缩毛巾", "轻便背包", "能量棒", "离线地图", "充电宝"],
      outfits: ["平价户外风", "工装裤", "速干 T 恤", "舒适运动鞋", "耐脏配色", "简约机能风"],
      moments: ["花得少，不代表看得少。", "攻略在手，冷门风景也能稳稳拿下。", "省钱不是将就，是更聪明地出发。"],
      tarotQuestions: ["我下一次省钱旅行会遇到什么惊喜？", "这条小众路线值得尝试吗？", "我近期适合和朋友探索哪里？"],
      ootd: { style: "舒适耐走", scene: "省钱小众探险", extra: "平价实用、耐走、防晒，适合组队徒步和冷门路线。" }
    },
    PGYW: {
      name: "稳妥性价比玩家",
      tags: ["严谨规划", "结伴游玩", "节俭出行", "安全保守"],
      core: "你喜欢有计划、有同伴、有性价比的旅行。你不追求极限体验，更重视大家安全、舒服、不花冤枉钱。",
      strength: "你很适合家庭出游、朋友短途、成熟景区和预算明确的轻松路线。",
      caution: "你可能会因为太重视不踩雷而错过新体验。可以每次只尝试一个小变化。",
      destinations: ["成熟景区", "城市周边短途", "亲友自驾", "博物馆路线", "古镇慢游", "温泉短途", "高评分平价民宿", "轻松海边"],
      gears: ["预算清单", "舒适鞋", "雨伞", "充电宝", "证件包", "保温杯", "常用药", "轻便背包"],
      outfits: ["基础休闲风", "舒适耐走", "简约外套", "低饱和配色", "日常实穿", "亲友游穿搭"],
      moments: ["不花冤枉钱，也不辜负好风景。", "安稳快乐，是最实在的旅行方式。", "计划刚刚好，风景也刚刚好。"],
      tarotQuestions: ["我近期适合推进哪段稳妥计划？", "下一次亲友出行需要注意什么？", "我如何在稳定中获得新的快乐？"],
      ootd: { style: "舒适耐走", scene: "稳妥性价比旅行", extra: "舒适、实穿、耐走，适合成熟景区、亲友短途和日常拍照。" }
    },
    PDJM: {
      name: "独行攻略大神",
      tags: ["精准攻略", "孤身独行", "追求质感", "硬核探险"],
      core: "你是很强的独立旅行者。你不依赖别人，也不随便将就，会把一个人的小众路线规划得清楚而高级。",
      strength: "你能兼顾独处、品质和探索，适合深度路线、摄影路线和高完成度独行。",
      caution: "你容易对自己要求过高。旅途不是项目交付，偶尔允许不完美也没关系。",
      destinations: ["独行摄影路线", "高端徒步路线", "小众海外城市", "荒野公路", "精品山野民宿", "冷门海岛", "高海拔路线", "深度文化旅行"],
      gears: ["高品质背包", "专业徒步鞋", "相机", "备用电池", "离线地图", "急救包", "保暖外套", "证件收纳"],
      outfits: ["高级机能风", "质感户外", "深色摄影穿搭", "利落长裤", "防风外套", "简约高质感"],
      moments: ["一个人把攻略做完，也一个人把山海看完。", "自律不是束缚，是我奔赴远方的底气。", "我独自出发，但从不草率。"],
      tarotQuestions: ["我下一次独行探索需要注意什么？", "这条深度路线适合我吗？", "我近期会在哪个方向获得突破？"],
      ootd: { style: "高级简约", scene: "独行深度探索", extra: "高级机能风，适合独行、摄影、徒步和小众目的地。" }
    },
    PDJW: {
      name: "静谧品质行者",
      tags: ["精细规划", "安静独行", "质感出行", "稳妥保守"],
      core: "你喜欢一个人安静地、体面地、稳稳地旅行。你的路线不一定夸张，但一定经过筛选，有品质，也有安全感。",
      strength: "你擅长规划舒适独处路线，适合高品质慢游、文化旅行和疗愈型目的地。",
      caution: "你可能太习惯掌控，导致旅途少了一些自然发生的惊喜。可以给自己留半天无计划时间。",
      destinations: ["高品质酒店", "美术馆城市", "园林古建", "安静海边", "温泉疗愈", "精品民宿", "书店街区", "成熟景区慢游"],
      gears: ["降噪耳机", "质感行李箱", "护肤包", "阅读书", "证件收纳", "轻便外套", "舒适鞋", "香氛小样"],
      outfits: ["高级简约", "低饱和套装", "质感风衣", "舒适平底鞋", "极简城市风", "独处氛围感穿搭"],
      moments: ["把行程安排妥当，再把自己交给风景。", "安静不是孤单，是我选择的秩序。", "一个人的旅途，也要有质感地发生。"],
      tarotQuestions: ["我近期适合怎样的独处旅程？", "下一段稳定计划会给我什么答案？", "我如何在安静中恢复能量？"],
      ootd: { style: "高级简约", scene: "品质独处慢游", extra: "高级、安静、低饱和，适合看展、古建、酒店和城市慢游。" }
    },
    PDYM: {
      name: "理智穷游探险家",
      tags: ["精打细算", "孤身出行", "低成本游玩", "热爱山野"],
      core: "你是理性和自由的结合体。你会认真规划路线、控制预算，然后一个人去更远更野的地方。",
      strength: "你能用有限预算完成高难度体验，独立性强，执行力强，适合徒步、穷游和自然探索。",
      caution: "你尤其要注意别过度压缩预算。安全、住宿、交通和装备是你的底线。",
      destinations: ["低成本徒步", "青年旅舍城市", "山野露营", "冷门自然景区", "公共交通旅行", "长线穷游", "小众古村", "森林徒步"],
      gears: ["徒步鞋", "离线地图", "压缩毛巾", "速干衣", "轻便背包", "头灯", "急救包", "能量棒"],
      outfits: ["简约户外风", "速干工装", "耐磨长裤", "轻便防晒", "平价机能", "徒步实用穿搭"],
      moments: ["花最少的钱，走最远的路。", "理智规划，自由发生。", "我把重量留给背包，把自由留给自己。"],
      tarotQuestions: ["我下一次独自穷游会遇到什么挑战？", "这条路线是否值得我投入精力？", "我近期该如何平衡自由和安全？"],
      ootd: { style: "舒适耐走", scene: "独行穷游徒步", extra: "低成本、实用、耐磨、防晒，适合长时间步行和自然探索。" }
    },
    PDYW: {
      name: "理性佛系旅行者",
      tags: ["严谨细致", "安静独处", "理性消费", "平缓出行"],
      core: "你喜欢简单、安静、可控的旅行。你会提前做好基本安排，然后用低成本、低消耗的方式给自己换一种状态。",
      strength: "你很适合短途散心、成熟路线、城市慢游和低预算独处旅行，稳定且不容易踩雷。",
      caution: "你可能过于克制，导致旅途缺少亮点。适当奖励自己一次体验，会让旅行更有温度。",
      destinations: ["成熟景区慢游", "城市公园", "书店路线", "安静古镇", "博物馆", "近郊湖边", "平价民宿", "轻松 citywalk"],
      gears: ["帆布包", "舒适鞋", "水杯", "充电宝", "折叠伞", "证件包", "轻便外套", "常用药"],
      outfits: ["极简舒适风", "浅色基础款", "低饱和穿搭", "宽松衬衫", "舒适长裤", "轻便平底鞋"],
      moments: ["不折腾，不浪费，也不亏待自己。", "一个人安静走走，世界就慢下来了。", "理性地出发，温柔地回来。"],
      tarotQuestions: ["我近期适合如何稳定自己的生活节奏？", "下一段独处散心会带给我什么？", "我需要在哪件事上对自己宽容一点？"],
      ootd: { style: "高级简约", scene: "理性佛系慢游", extra: "极简、舒适、低饱和，适合散心、看展、成熟景区和城市慢游。" }
    }
  };

  function getFullName(code) {
    return `${dimensionText[code[0]]} · ${dimensionText[code[1]]} · ${dimensionText[code[2]]} · ${dimensionText[code[3]]}型`;
  }

  function buildToneSet(code, seed) {
    const fullName = getFullName(code);

    return [
      {
        style: "温柔版",
        text: [
          `你是 ${code}「${seed.name}」，属于${fullName}。你的旅行方式带着很鲜明的个人气质：${seed.core}`,
          `你不是为了完成打卡任务才出发，而是在旅途中寻找一种更适合自己的生活状态。你会在「想去哪、和谁去、怎么花钱、走多远」之间形成自己的判断，这些判断共同构成了你的 BBTI 出行人格。`,
          `${seed.strength} 这让你在旅途中很容易拥有属于自己的节奏，不会轻易被别人的标准带偏。`,
          `不过也要记得：${seed.caution} 只要保留一点弹性和底线，你的旅途会更自由，也更稳。`
        ]
      },
      {
        style: "高级版",
        text: [
          `${code}「${seed.name}」的核心，不只是一次旅行偏好，而是一套关于自由、秩序、关系、消费和探索的行为索引。你呈现出的类型是${fullName}。`,
          `${seed.core} 你对旅途的选择通常不是随机的，而是由你对舒适度、掌控感、社交能量和未知世界的判断共同驱动。`,
          `你的优势在于：${seed.strength} 你能把旅行从简单移动变成一种自我表达，让目的地、同行人和体验方式都服务于你的真实需求。`,
          `需要提醒的是：${seed.caution} 当你能在热爱与理性之间取得平衡，你的每一次出发都会更接近理想状态。`
        ]
      },
      {
        style: "直白版",
        text: [
          `你的 BBTI 是 ${code}「${seed.name}」，简单说，你是${fullName}。`,
          `${seed.core} 你出门玩不是随便凑合的人，你有自己的一套标准。有人在意省钱，有人在意舒服，有人在意热闹，有人在意独处，而你这四个维度组合在一起，就形成了现在这个结果。`,
          `你的强项很明显：${seed.strength} 所以你适合选择真正符合自己节奏的路线，而不是盲目照搬别人的攻略。`,
          `但你的短板也要看见：${seed.caution} 只要提前补上这个漏洞，你的旅行体验会提升很多。`
        ]
      },
      {
        style: "幽默版",
        text: [
          `恭喜你解锁 ${code}「${seed.name}」！你的出行人格是${fullName}，属于那种一旦进入旅行状态，就会暴露真实生活哲学的人。`,
          `${seed.core} 你不是单纯出去玩，你是在用旅行实践自己的人生态度：该快乐就快乐，该讲究就讲究，该省就省，该冲就冲。`,
          `你的隐藏技能是：${seed.strength} 放在队伍里，你往往不是普通游客，而是能改变旅行气氛的人。`,
          `当然，系统也要友情提醒：${seed.caution} 浪漫可以有，快乐可以有，但别让旅途变成大型翻车现场。`
        ]
      },
      {
        style: "文艺版",
        text: [
          `你的 BBTI 出行人格是 ${code}「${seed.name}」，属于${fullName}。你选择旅途的方式，也像是在选择一种和世界相处的姿态。`,
          `${seed.core} 有些人把旅行当作逃离，有些人把旅行当作抵达，而你更像是在路上确认自己真正需要什么。`,
          `${seed.strength} 这份特质让你的旅途不只是照片和坐标，而会成为一段有温度、有情绪、有回声的记忆。`,
          `愿你也记得：${seed.caution} 当自由有了边界，远方才会真正成为礼物。`
        ]
      }
    ];
  }

  function buildProfile(code, seed) {
    return {
      code,
      name: seed.name,
      fullName: getFullName(code),
      tags: seed.tags,
      tones: buildToneSet(code, seed),
      destinations: seed.destinations,
      gears: seed.gears,
      outfits: seed.outfits,
      moments: seed.moments,
      tarotQuestions: seed.tarotQuestions,
      ootd: {
        bbti: code,
        ...seed.ootd
      }
    };
  }

  window.BBTI_RESULT_MAP = Object.fromEntries(
    Object.entries(profileSeed).map(([code, seed]) => {
      return [code, buildProfile(code, seed)];
    })
  );
})();
/*
  BBTI 出行人格测试器
  主逻辑文件

  数据依赖：
  window.BBTI_QUESTION_BANK = []
  window.BBTI_RESULT_MAP = {}

  下一步会继续补充：
  1. 200 道题库
  2. 16 种人格结果
  3. 每种人格 5 套长文话术
*/

const BBTI_STORAGE_KEYS = {
  progress: "sunflower_bbti_progress_v1",
  result: "sunflower_bbti_result_v1"
};

const BBTI_AXIS_CONFIG = {
  decision: {
    name: "出行决策",
    left: "S",
    right: "P",
    leftName: "随性",
    rightName: "规划",
    order: 1
  },
  social: {
    name: "出行社交",
    left: "G",
    right: "D",
    leftName: "群居",
    rightName: "独处",
    order: 2
  },
  consume: {
    name: "消费偏好",
    left: "J",
    right: "Y",
    leftName: "精致",
    rightName: "简约",
    order: 3
  },
  explore: {
    name: "探索属性",
    left: "M",
    right: "W",
    leftName: "冒险",
    rightName: "安稳",
    order: 4
  }
};

const BBTI_QUIZ_QUOTA = {
  decision: 8,
  social: 8,
  consume: 7,
  explore: 7
};

const bbtiState = {
  step: "bbtiWelcome",
  questions: [],
  currentIndex: 0,
  answers: {},
  result: null
};

const bbtiStepIds = [
  "bbtiWelcome",
  "bbtiIntro",
  "bbtiQuiz",
  "bbtiCalculating",
  "bbtiResult"
];

/* --------------------------
   基础工具函数
-------------------------- */

function bbtiGetQuestionBank() {
  return Array.isArray(window.BBTI_QUESTION_BANK)
    ? window.BBTI_QUESTION_BANK
    : [];
}

function bbtiGetResultMap() {
  return window.BBTI_RESULT_MAP && typeof window.BBTI_RESULT_MAP === "object"
    ? window.BBTI_RESULT_MAP
    : {};
}

function bbtiEscapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bbtiRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function bbtiShuffle(list) {
  const arr = [...list];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function bbtiPickMany(list, count) {
  return bbtiShuffle(list).slice(0, count);
}

function bbtiClamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function bbtiToPercent(value, total) {
  if (!total) return 50;
  return Math.round((value / total) * 100);
}

function bbtiShowToast(message) {
  const toast = document.getElementById("bbtiToast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(bbtiShowToast.timer);
  bbtiShowToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function bbtiShowStep(stepId) {
  bbtiStepIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active", id === stepId);
  });

  bbtiState.step = stepId;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* --------------------------
   localStorage
-------------------------- */

function bbtiSaveProgress() {
  const payload = {
    questions: bbtiState.questions,
    currentIndex: bbtiState.currentIndex,
    answers: bbtiState.answers,
    savedAt: Date.now()
  };

  localStorage.setItem(BBTI_STORAGE_KEYS.progress, JSON.stringify(payload));
}

function bbtiLoadProgress() {
  try {
    const raw = localStorage.getItem(BBTI_STORAGE_KEYS.progress);
    if (!raw) return null;

    const data = JSON.parse(raw);

    if (!Array.isArray(data.questions) || !data.questions.length) return null;
    if (!data.answers || typeof data.answers !== "object") return null;

    return data;
  } catch (error) {
    console.warn("BBTI 读取进度失败：", error);
    return null;
  }
}

function bbtiClearProgress() {
  localStorage.removeItem(BBTI_STORAGE_KEYS.progress);
}

function bbtiSaveResult(result) {
  localStorage.setItem(BBTI_STORAGE_KEYS.result, JSON.stringify({
    result,
    savedAt: Date.now()
  }));
}

function bbtiLoadResult() {
  try {
    const raw = localStorage.getItem(BBTI_STORAGE_KEYS.result);
    if (!raw) return null;

    const data = JSON.parse(raw);
    return data.result || null;
  } catch (error) {
    console.warn("BBTI 读取结果失败：", error);
    return null;
  }
}

/* --------------------------
   初始化与入口
-------------------------- */

function initBbti() {
  bindBbtiEvents();
  syncWelcomeButtons();
}

function syncWelcomeButtons() {
  const resumeBtn = document.getElementById("resumeBbtiBtn");
  const viewLastResultBtn = document.getElementById("viewLastResultBtn");

  const progress = bbtiLoadProgress();
  const result = bbtiLoadResult();

  if (resumeBtn) {
    resumeBtn.hidden = !progress;
  }

  if (viewLastResultBtn) {
    viewLastResultBtn.hidden = !result;
  }
}

function bindBbtiEvents() {
  const startBtn = document.getElementById("startBbtiBtn");
  const resumeBtn = document.getElementById("resumeBbtiBtn");
  const viewLastResultBtn = document.getElementById("viewLastResultBtn");
  const backWelcomeBtn = document.getElementById("backWelcomeBtn");
  const beginQuestionsBtn = document.getElementById("beginQuestionsBtn");

  const prevQuestionBtn = document.getElementById("prevQuestionBtn");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const saveAndExitBtn = document.getElementById("saveAndExitBtn");

  const restartTestBtn = document.getElementById("restartTestBtn");
  const copyResultBtn = document.getElementById("copyResultBtn");
  const createPosterBtn = document.getElementById("createPosterBtn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      bbtiShowStep("bbtiIntro");
    });
  }

  if (resumeBtn) {
    resumeBtn.addEventListener("click", resumeBbtiTest);
  }

  if (viewLastResultBtn) {
    viewLastResultBtn.addEventListener("click", () => {
      const result = bbtiLoadResult();

      if (!result) {
        bbtiShowToast("暂无上次结果。");
        syncWelcomeButtons();
        return;
      }

      bbtiState.result = result;
      renderBbtiResult(result);
      bbtiShowStep("bbtiResult");
    });
  }

  if (backWelcomeBtn) {
    backWelcomeBtn.addEventListener("click", () => {
      bbtiShowStep("bbtiWelcome");
    });
  }

  if (beginQuestionsBtn) {
    beginQuestionsBtn.addEventListener("click", startNewBbtiTest);
  }

  if (prevQuestionBtn) {
    prevQuestionBtn.addEventListener("click", goPrevQuestion);
  }

  if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener("click", goNextQuestion);
  }

  if (saveAndExitBtn) {
    saveAndExitBtn.addEventListener("click", () => {
      bbtiSaveProgress();
      bbtiShowToast("已保存进度，下次可以继续测试。");
      bbtiShowStep("bbtiWelcome");
      syncWelcomeButtons();
    });
  }

  if (restartTestBtn) {
    restartTestBtn.addEventListener("click", () => {
      bbtiClearProgress();
      startNewBbtiTest();
    });
  }

  if (copyResultBtn) {
    copyResultBtn.addEventListener("click", copyBbtiResult);
  }

  if (createPosterBtn) {
    createPosterBtn.addEventListener("click", createBbtiPoster);
  }
}

/* --------------------------
   抽题逻辑
-------------------------- */

function startNewBbtiTest() {
  const bank = bbtiGetQuestionBank();

  if (!bank.length) {
    bbtiShowToast("BBTI 题库还未加载，请继续添加题库数据。");
    return;
  }

  const questions = buildBalancedQuestionSet(bank);

  if (questions.length < 30) {
    bbtiShowToast("题库数量不足，请检查四个维度题目是否完整。");
    return;
  }

  bbtiState.questions = questions;
  bbtiState.currentIndex = 0;
  bbtiState.answers = {};
  bbtiState.result = null;

  bbtiSaveProgress();
  renderCurrentQuestion();
  bbtiShowStep("bbtiQuiz");
}

function resumeBbtiTest() {
  const progress = bbtiLoadProgress();

  if (!progress) {
    bbtiShowToast("没有可继续的测试进度。");
    syncWelcomeButtons();
    return;
  }

  bbtiState.questions = progress.questions || [];
  bbtiState.currentIndex = Number(progress.currentIndex || 0);
  bbtiState.answers = progress.answers || {};

  renderCurrentQuestion();
  bbtiShowStep("bbtiQuiz");
}

function buildBalancedQuestionSet(bank) {
  const picked = [];

  Object.keys(BBTI_QUIZ_QUOTA).forEach(axis => {
    const axisQuestions = bank.filter(item => item.axis === axis);
    const count = BBTI_QUIZ_QUOTA[axis];

    picked.push(...bbtiPickMany(axisQuestions, count));
  });

  return bbtiShuffle(picked).slice(0, 30);
}

/* --------------------------
   答题渲染
-------------------------- */

function renderCurrentQuestion() {
  const question = bbtiState.questions[bbtiState.currentIndex];

  if (!question) {
    bbtiShowToast("题目加载异常，请重新开始。");
    bbtiShowStep("bbtiWelcome");
    return;
  }

  const questionTitle = document.getElementById("questionTitle");
  const questionCount = document.getElementById("questionCount");
  const questionText = document.getElementById("questionText");
  const optionGrid = document.getElementById("optionGrid");
  const progressBar = document.getElementById("quizProgressBar");
  const prevBtn = document.getElementById("prevQuestionBtn");
  const nextBtn = document.getElementById("nextQuestionBtn");

  const total = bbtiState.questions.length;
  const current = bbtiState.currentIndex + 1;
  const savedAnswer = bbtiState.answers[question.id];

  if (questionTitle) {
    const axisInfo = BBTI_AXIS_CONFIG[question.axis];
    questionTitle.textContent = axisInfo ? axisInfo.name : "旅行情景题";
  }

  if (questionCount) {
    questionCount.textContent = `${current} / ${total}`;
  }

  if (questionText) {
    questionText.textContent = question.text;
  }

  if (progressBar) {
    progressBar.style.width = `${Math.round((current / total) * 100)}%`;
  }

  if (prevBtn) {
    prevBtn.disabled = bbtiState.currentIndex === 0;
  }

  if (nextBtn) {
    nextBtn.disabled = !savedAnswer;
    nextBtn.textContent = current >= total ? "生成结果" : "下一题";
  }

  if (!optionGrid) return;

  optionGrid.innerHTML = "";

  question.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "bbti-option";
    btn.type = "button";

    if (savedAnswer && savedAnswer.optionId === option.id) {
      btn.classList.add("active");
    }

    btn.innerHTML = `
      <span class="bbti-option-key">${index === 0 ? "A" : "B"}</span>
      <span class="bbti-option-text">${bbtiEscapeHTML(option.text)}</span>
    `;

    btn.addEventListener("click", () => {
      selectBbtiOption(question, option);
    });

    optionGrid.appendChild(btn);
  });
}

function selectBbtiOption(question, option) {
  bbtiState.answers[question.id] = {
    questionId: question.id,
    axis: question.axis,
    optionId: option.id,
    code: option.code,
    weight: Number(option.weight || question.weight || 1),
    text: option.text
  };

  bbtiSaveProgress();
  renderCurrentQuestion();

  const isLast = bbtiState.currentIndex >= bbtiState.questions.length - 1;

  if (!isLast) {
    setTimeout(() => {
      goNextQuestion();
    }, 180);
  }
}

function goPrevQuestion() {
  if (bbtiState.currentIndex <= 0) return;

  bbtiState.currentIndex -= 1;
  bbtiSaveProgress();
  renderCurrentQuestion();
}

function goNextQuestion() {
  const question = bbtiState.questions[bbtiState.currentIndex];

  if (!question) return;

  const answer = bbtiState.answers[question.id];

  if (!answer) {
    bbtiShowToast("请先选择一个答案。");
    return;
  }

  const isLast = bbtiState.currentIndex >= bbtiState.questions.length - 1;

  if (isLast) {
    finishBbtiTest();
    return;
  }

  bbtiState.currentIndex += 1;
  bbtiSaveProgress();
  renderCurrentQuestion();
}

/* --------------------------
   计分与结果生成
-------------------------- */

function finishBbtiTest() {
  const total = bbtiState.questions.length;
  const answeredCount = Object.keys(bbtiState.answers).length;

  if (answeredCount < total) {
    bbtiShowToast("还有题目未完成。");
    return;
  }

  bbtiShowStep("bbtiCalculating");

  setTimeout(() => {
    const result = calculateBbtiResult();

    bbtiState.result = result;
    bbtiSaveResult(result);
    bbtiClearProgress();

    renderBbtiResult(result);
    bbtiShowStep("bbtiResult");
    syncWelcomeButtons();
  }, 900);
}

function calculateBbtiResult() {
  const scores = {
    S: 0,
    P: 0,
    G: 0,
    D: 0,
    J: 0,
    Y: 0,
    M: 0,
    W: 0
  };

  Object.values(bbtiState.answers).forEach(answer => {
    if (scores[answer.code] === undefined) return;
    scores[answer.code] += Number(answer.weight || 1);
  });

  const axisResults = buildAxisResults(scores);
  const code = buildBbtiCode(axisResults);
  const clarity = calculateClarity(axisResults);

  const resultMap = bbtiGetResultMap();
  const profile = resultMap[code] || buildFallbackProfile(code, axisResults);

  const tone = bbtiRandomItem(profile.tones || []);
  const dynamicAnalysis = buildDynamicAnalysis(axisResults);
  const recommendations = buildRecommendations(profile, axisResults);

  const tarotQuestion = buildTarotQuestion(profile, axisResults);
  const ootdParams = buildOotdParams(profile, axisResults);

  return {
    code,
    profile,
    tone,
    scores,
    axisResults,
    clarity,
    dynamicAnalysis,
    recommendations,
    tarotQuestion,
    ootdParams,
    createdAt: Date.now()
  };
}

function buildAxisResults(scores) {
  return Object.entries(BBTI_AXIS_CONFIG)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([axisKey, axis]) => {
      const leftScore = scores[axis.left] || 0;
      const rightScore = scores[axis.right] || 0;
      const total = leftScore + rightScore;

      const leftPercent = bbtiToPercent(leftScore, total);
      const rightPercent = 100 - leftPercent;

      const winner = leftScore >= rightScore ? axis.left : axis.right;
      const winnerName = winner === axis.left ? axis.leftName : axis.rightName;
      const loserName = winner === axis.left ? axis.rightName : axis.leftName;
      const winnerPercent = winner === axis.left ? leftPercent : rightPercent;

      return {
        axisKey,
        axisName: axis.name,
        left: axis.left,
        right: axis.right,
        leftName: axis.leftName,
        rightName: axis.rightName,
        leftScore,
        rightScore,
        leftPercent,
        rightPercent,
        winner,
        winnerName,
        loserName,
        winnerPercent
      };
    });
}

function buildBbtiCode(axisResults) {
  return axisResults.map(item => item.winner).join("");
}

function calculateClarity(axisResults) {
  if (!axisResults.length) return 50;

  const sumWinnerPercent = axisResults.reduce((sum, item) => {
    return sum + item.winnerPercent;
  }, 0);

  return Math.round(sumWinnerPercent / axisResults.length);
}

function buildFallbackProfile(code, axisResults) {
  const fullName = axisResults.map(item => item.winnerName).join(" · ");

  return {
    code,
    name: "旅行人格探索者",
    fullName: `${fullName}型`,
    tags: ["旅行偏好", "自我探索", "出行参考", "动态报告"],
    tones: [
      {
        style: "默认版",
        text: [
          `你本次测出的 BBTI 编码是 ${code}，代表你在旅行中更倾向于「${fullName}」。`,
          "这是一份基于你本次选择生成的出行偏好报告。完整人格结果库会在下一步补充后展示更丰富的长文解析、推荐内容和专属话术。"
        ]
      }
    ],
    destinations: ["城市周边短途", "自然风光路线", "适合放松的目的地"],
    gears: ["充电宝", "轻便背包", "舒适鞋", "防晒用品"],
    outfits: ["舒适耐走", "轻便层次", "适合拍照"],
    moments: ["今天不赶路，只和风一起走。"],
    tarotQuestions: ["我近期适合开启一段怎样的旅途？"],
    ootd: {
      style: "舒适耐走",
      scene: "旅行出片",
      extra: "根据 BBTI 出行人格，推荐兼顾舒适、拍照和目的地氛围的穿搭。"
    }
  };
}

/* --------------------------
   动态差异化解析
-------------------------- */

function buildDynamicAnalysis(axisResults) {
  return axisResults.map(item => {
    const percent = item.winnerPercent;
    const level = getPreferenceLevel(percent);

    let sentence = "";

    if (level === "strong") {
      sentence = `你的「${item.winnerName}」倾向非常明显，说明这个特质已经比较稳定地影响你的旅行选择。你在出发、同行、消费或探索时，往往会自然优先选择更符合「${item.winnerName}」的方式。`;
    } else if (level === "clear") {
      sentence = `你整体偏向「${item.winnerName}」，但并不是完全排斥「${item.loserName}」。这说明你的旅行偏好有明确方向，同时保留一定弹性。`;
    } else if (level === "soft") {
      sentence = `你略微偏向「${item.winnerName}」，但和「${item.loserName}」差距不大。你可能会根据目的地、同行人、预算和当下状态切换旅行方式。`;
    } else {
      sentence = `你在「${item.winnerName}」与「${item.loserName}」之间比较接近，属于边界型偏好。你不是单一模式的人，更适合给自己保留选择空间。`;
    }

    return {
      axisName: item.axisName,
      title: `${item.axisName}：${item.winnerName} ${percent}%`,
      text: sentence
    };
  });
}

function getPreferenceLevel(percent) {
  if (percent >= 80) return "strong";
  if (percent >= 65) return "clear";
  if (percent >= 56) return "soft";
  return "mixed";
}

/* --------------------------
   推荐内容生成
-------------------------- */

function buildRecommendations(profile, axisResults) {
  const destinations = bbtiPickMany(profile.destinations || [], 5);
  const gears = bbtiPickMany(profile.gears || [], 6);
  const outfits = bbtiPickMany(profile.outfits || [], 6);
  const moments = bbtiPickMany(profile.moments || [], 3);

  return {
    destinations,
    gears,
    outfits,
    moments
  };
}

function buildTarotQuestion(profile, axisResults) {
  const pool = profile.tarotQuestions || [
    "我近期适合开启一段怎样的旅途？",
    "下一次出发会给我带来什么新的能量？",
    "我接下来在旅行和生活中需要注意什么？"
  ];

  return bbtiRandomItem(pool);
}

function buildOotdParams(profile, axisResults) {
  const ootd = profile.ootd || {};

  return {
    bbti: profile.code,
    style: ootd.style || "舒适耐走",
    scene: ootd.scene || "旅行出片",
    extra: ootd.extra || `根据我的 BBTI 出行人格 ${profile.code}，推荐适合旅行拍照且舒适的穿搭。`
  };
}

/* --------------------------
   结果渲染
-------------------------- */

function renderBbtiResult(result) {
  if (!result) return;

  const profile = result.profile || {};
  const tone = result.tone || {};

  setText("resultCode", result.code);
  setText("resultName", profile.name || "旅行人格探索者");
  setText("resultFullName", profile.fullName || "");
  setText("clarityText", `人格明确度 ${result.clarity}%`);
  setText("toneStyle", tone.style || "随机话术");

  renderTags(profile.tags || []);
  renderAxisList(result.axisResults || []);
  renderLongAnalysis(tone);
  renderDynamicAnalysis(result.dynamicAnalysis || []);
  renderRecommendationLists(result);
  renderBbtiLinks(result);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

function renderTags(tags) {
  const box = document.getElementById("resultTags");
  if (!box) return;

  box.innerHTML = tags
    .map(tag => `<span>${bbtiEscapeHTML(tag)}</span>`)
    .join("");
}

function renderAxisList(axisResults) {
  const box = document.getElementById("axisList");
  if (!box) return;

  box.innerHTML = axisResults.map(item => {
    const fillWidth = item.winner === item.left
      ? item.leftPercent
      : item.rightPercent;

    return `
      <div class="bbti-axis-item">
        <div class="bbti-axis-top">
          <span>${bbtiEscapeHTML(item.axisName)}：${bbtiEscapeHTML(item.winnerName)}</span>
          <span>${item.winnerPercent}%</span>
        </div>

        <div class="bbti-axis-track">
          <div class="bbti-axis-fill" style="width:${fillWidth}%"></div>
        </div>

        <div class="bbti-axis-bottom">
          <span>${item.leftName} ${item.leftPercent}%</span>
          <span>${item.rightName} ${item.rightPercent}%</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderLongAnalysis(tone) {
  const box = document.getElementById("longAnalysis");
  if (!box) return;

  const paragraphs = Array.isArray(tone.text)
    ? tone.text
    : [tone.text || "暂无解析。"];

  box.innerHTML = paragraphs
    .map(item => `<p>${bbtiEscapeHTML(item)}</p>`)
    .join("");
}

function renderDynamicAnalysis(list) {
  const box = document.getElementById("dynamicAnalysis");
  if (!box) return;

  box.innerHTML = list.map(item => {
    return `
      <p>
        <strong>${bbtiEscapeHTML(item.title)}</strong><br />
        ${bbtiEscapeHTML(item.text)}
      </p>
    `;
  }).join("");
}

function renderRecommendationLists(result) {
  const rec = result.recommendations || {};

  renderChipList("destinationList", rec.destinations || []);
  renderChipList("gearList", rec.gears || []);
  renderChipList("outfitList", rec.outfits || []);

  const momentBox = document.getElementById("momentList");
  if (momentBox) {
    momentBox.innerHTML = (rec.moments || [])
      .map(item => `<p>${bbtiEscapeHTML(item)}</p>`)
      .join("");
  }
}

function renderChipList(id, list) {
  const box = document.getElementById(id);
  if (!box) return;

  box.innerHTML = list
    .map(item => `<span>${bbtiEscapeHTML(item)}</span>`)
    .join("");
}

function renderBbtiLinks(result) {
  const tarotLink = document.getElementById("goTarotLink");
  const ootdLink = document.getElementById("goOotdLink");
  const tarotPreview = document.getElementById("tarotQuestionPreview");
  const ootdPreview = document.getElementById("ootdStylePreview");

  const question = result.tarotQuestion || "我近期适合开启一段怎样的旅途？";
  const ootd = result.ootdParams || {};

  if (tarotPreview) {
    tarotPreview.textContent = question;
  }

  if (ootdPreview) {
    ootdPreview.textContent = `${ootd.style || "舒适耐走"} · ${ootd.scene || "旅行出片"}`;
  }

  if (tarotLink) {
    const tarotUrl = new URL("./tarot.html", window.location.href);
    tarotUrl.searchParams.set("from", "bbti");
    tarotUrl.searchParams.set("bbti", result.code);
    tarotUrl.searchParams.set("category", "fortune");
    tarotUrl.searchParams.set("spread", "single");
    tarotUrl.searchParams.set("q", question);

    tarotLink.href = tarotUrl.pathname + tarotUrl.search;
  }

  if (ootdLink) {
    const ootdUrl = new URL("./ootd.html", window.location.href);
    ootdUrl.searchParams.set("from", "bbti");
    ootdUrl.searchParams.set("bbti", result.code);
    ootdUrl.searchParams.set("style", ootd.style || "舒适耐走");
    ootdUrl.searchParams.set("scene", ootd.scene || "旅行出片");
    ootdUrl.searchParams.set("extra", ootd.extra || "");

    ootdLink.href = ootdUrl.pathname + ootdUrl.search;
  }
}

/* --------------------------
   复制结果
-------------------------- */

function buildBbtiShareText(result = bbtiState.result) {
  if (!result) return "";

  const profile = result.profile || {};
  const tone = result.tone || {};
  const rec = result.recommendations || {};

  const axisText = (result.axisResults || []).map(item => {
    return `${item.axisName}：${item.winnerName} ${item.winnerPercent}%（${item.leftName} ${item.leftPercent}% / ${item.rightName} ${item.rightPercent}%）`;
  }).join("\n");

  const toneText = Array.isArray(tone.text)
    ? tone.text.join("\n")
    : String(tone.text || "");

  const link = location.origin
    ? `${location.origin}${location.pathname.replace(/\/[^/]*$/, "/")}bbti.html`
    : location.href.split("#")[0];

  return `🧭 我的 BBTI 出行人格结果

人格编码：${result.code}
人格名称：${profile.name || ""}
人格类型：${profile.fullName || ""}
人格明确度：${result.clarity}%

人设标签：
${(profile.tags || []).join(" / ")}

四维偏好：
${axisText}

人格解析：
${toneText}

适合目的地：
${(rec.destinations || []).join("、")}

装备建议：
${(rec.gears || []).join("、")}

穿搭建议：
${(rec.outfits || []).join("、")}

朋友圈文案：
${(rec.moments || []).join("\n")}

我的塔罗推荐问题：
${result.tarotQuestion || "我近期适合开启一段怎样的旅途？"}

来测测你的 BBTI 出行人格：
${link}`;
}

async function copyBbtiResult() {
  const result = bbtiState.result || bbtiLoadResult();

  if (!result) {
    bbtiShowToast("暂无可复制的结果。");
    return;
  }

  const text = buildBbtiShareText(result);

  try {
    await navigator.clipboard.writeText(text);
    bbtiShowToast("BBTI 结果已复制，可以分享给好友。");
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();

    bbtiShowToast("BBTI 结果已复制。");
  }
}

/* --------------------------
   Canvas 海报
-------------------------- */

function bbtiWrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const chars = String(text || "").split("");
  let line = "";
  const lines = [];

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      lines.push(line);
      line = chars[i];

      if (lines.length >= maxLines) {
        line = "";
        break;
      }
    } else {
      line = testLine;
    }
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  lines.forEach((item, index) => {
    ctx.fillText(item, x, y + index * lineHeight);
  });

  return y + lines.length * lineHeight;
}

function bbtiCanvasRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function createBbtiPoster() {
  const result = bbtiState.result || bbtiLoadResult();

  if (!result) {
    bbtiShowToast("暂无可生成海报的结果。");
    return;
  }

  const profile = result.profile || {};
  const tone = result.tone || {};
  const rec = result.recommendations || {};

  const canvas = document.createElement("canvas");
  const width = 900;
  const height = 1420;
  const dpr = Math.max(2, window.devicePixelRatio || 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#4f7cff");
  gradient.addColorStop(0.48, "#7c3aed");
  gradient.addColorStop(1, "#fff7ed");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 130; i++) {
    ctx.fillStyle = i % 6 === 0
      ? "rgba(250,204,21,0.48)"
      : "rgba(255,255,255,0.28)";

    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 1.8 + 0.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,255,255,0.14)";
  bbtiCanvasRoundRect(ctx, 50, 50, width - 100, height - 150, 40);
  ctx.fill();

  ctx.fillStyle = "#fef3c7";
  ctx.font = "800 28px sans-serif";
  ctx.fillText("BBTI Travel Personality", 76, 105);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 56px sans-serif";
  ctx.fillText("我的出行人格", 76, 178);

  ctx.fillStyle = "#facc15";
  ctx.font = "1000 86px sans-serif";
  ctx.fillText(result.code, 76, 285);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 52px sans-serif";
  ctx.fillText(profile.name || "旅行人格探索者", 76, 358);

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "28px sans-serif";
  bbtiWrapCanvasText(ctx, profile.fullName || "", 76, 410, width - 152, 40, 2);

  let y = 500;

  ctx.fillStyle = "rgba(255,255,255,0.16)";
  bbtiCanvasRoundRect(ctx, 76, y, width - 152, 138, 28);
  ctx.fill();

  ctx.fillStyle = "#fef3c7";
  ctx.font = "900 28px sans-serif";
  ctx.fillText(`人格明确度 ${result.clarity}%`, 106, y + 45);

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "24px sans-serif";
  const tagsText = (profile.tags || []).slice(0, 4).join(" / ");
  bbtiWrapCanvasText(ctx, tagsText, 106, y + 88, width - 212, 34, 2);

  y += 178;

  ctx.fillStyle = "rgba(255,255,255,0.16)";
  bbtiCanvasRoundRect(ctx, 76, y, width - 152, 270, 28);
  ctx.fill();

  ctx.fillStyle = "#fef3c7";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("四维偏好", 106, y + 45);

  let axisY = y + 86;
  (result.axisResults || []).forEach(item => {
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.font = "700 22px sans-serif";
    ctx.fillText(`${item.axisName}：${item.winnerName} ${item.winnerPercent}%`, 106, axisY);

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    bbtiCanvasRoundRect(ctx, 106, axisY + 14, width - 212, 18, 9);
    ctx.fill();

    ctx.fillStyle = "#facc15";
    bbtiCanvasRoundRect(ctx, 106, axisY + 14, (width - 212) * item.winnerPercent / 100, 18, 9);
    ctx.fill();

    axisY += 48;
  });

  y += 318;

  ctx.fillStyle = "rgba(255,255,255,0.16)";
  bbtiCanvasRoundRect(ctx, 76, y, width - 152, 300, 28);
  ctx.fill();

  ctx.fillStyle = "#fef3c7";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("人格解析", 106, y + 45);

  const toneText = Array.isArray(tone.text)
    ? tone.text.join("")
    : String(tone.text || "");

  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "25px sans-serif";
  bbtiWrapCanvasText(ctx, toneText, 106, y + 88, width - 212, 38, 5);

  y += 346;

  ctx.fillStyle = "rgba(255,255,255,0.16)";
  bbtiCanvasRoundRect(ctx, 76, y, width - 152, 160, 28);
  ctx.fill();

  ctx.fillStyle = "#fef3c7";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("适合我的旅途", 106, y + 45);

  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "24px sans-serif";
  bbtiWrapCanvasText(
    ctx,
    (rec.destinations || []).slice(0, 5).join("、"),
    106,
    y + 88,
    width - 212,
    36,
    2
  );

  const footerY = height - 105;

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "22px sans-serif";
  ctx.fillText("向日葵工具箱 · BBTI 出行人格测试器", 76, footerY);

  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.font = "18px sans-serif";
  ctx.fillText("原创旅行偏好测试，仅供娱乐与出行参考", 76, footerY + 34);

  const imageUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `bbti-${result.code}-${Date.now()}.png`;

  try {
    link.click();
    bbtiShowToast("人格海报已生成。");
  } catch (error) {
    window.open(imageUrl, "_blank");
  }
}

/* --------------------------
   页面跳转参数生成辅助
-------------------------- */

function buildQueryString(params) {
  const search = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });

  return search.toString();
}

/* --------------------------
   启动
-------------------------- */

document.addEventListener("DOMContentLoaded", initBbti);