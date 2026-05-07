const tarotState = {
  step: "stepWelcome",
  category: "love",
  spread: "single",
  question: "",
  confirmed: false,
  selectedCards: [],
  revealedCount: 0
};

const categoryMap = {
  love: "感情",
  career: "工作",
  study: "学业"
};

const spreadMap = {
  single: {
    name: "单牌指引",
    count: 1,
    positions: ["核心指引"]
  },
  three: {
    name: "三牌圣三角",
    count: 3,
    positions: ["过去影响", "现在状态", "未来趋势"]
  }
};

const tarotDeck = [
  {
    name: "愚者",
    symbol: "🌱",
    upright: {
      love: "感情中有新的开始，可能出现轻松、自然、令人心动的互动。适合放下过度防备，但不要因为新鲜感而忽略现实边界。",
      career: "工作上适合尝试新方向、新项目或新合作。你可能还没有完整计划，但行动会带来新的机会。",
      study: "学业上代表探索新知识、转换学习方式。适合从兴趣切入，但需要避免三分钟热度。"
    },
    reversed: {
      love: "感情中容易冲动、逃避承诺，或对关系判断过于天真。建议先观察对方行动，不要急着投入全部情绪。",
      career: "工作上可能存在准备不足、计划松散的问题。机会虽有，但需要补足细节再出发。",
      study: "学习状态可能分散，容易被兴趣之外的事情吸引。建议设定短期目标，先稳定节奏。"
    }
  },
  {
    name: "魔术师",
    symbol: "✨",
    upright: {
      love: "你在关系中具备吸引力与表达力，适合主动沟通。单身者有机会通过展示真实优势吸引对方。",
      career: "资源、能力与时机正在聚合，适合推进方案、展示作品、争取机会。",
      study: "学习效率提升，理解力和表达力增强。适合备考、演讲、写作和技能训练。"
    },
    reversed: {
      love: "关系里可能存在话术、试探或信息不透明。不要只听承诺，要看实际行动。",
      career: "工作中需警惕沟通误差或过度包装。把事情做扎实，比表现更重要。",
      study: "容易看似很忙，实际产出不足。需要减少技巧依赖，回到基础。"
    }
  },
  {
    name: "女祭司",
    symbol: "🌙",
    upright: {
      love: "感情中有未说出口的情绪，直觉很重要。适合慢慢观察，不必急着逼问答案。",
      career: "工作上隐藏信息较多，适合收集资料、低调判断。你的洞察力会帮助你避开风险。",
      study: "适合深度学习、研究、复盘。安静独处时更容易获得突破。"
    },
    reversed: {
      love: "你可能忽略了直觉，或被暧昧信息困扰。建议把模糊感受转化为明确沟通。",
      career: "信息不完整导致误判。不要凭猜测行动，先确认关键事实。",
      study: "学习中容易焦虑或闭门造车。可以寻求老师、同学或资料辅助。"
    }
  },
  {
    name: "女皇",
    symbol: "🌹",
    upright: {
      love: "关系进入温暖、滋养、稳定增长的阶段。适合表达关心，也适合修复亲密感。",
      career: "项目有成长空间，适合做内容、审美、用户体验、服务类工作。成果会逐渐显现。",
      study: "学习状态较舒展，适合积累型科目。你会从稳定练习中看到进步。"
    },
    reversed: {
      love: "感情中可能有过度付出、依赖或期待回报的问题。需要重新平衡双方能量。",
      career: "工作成果可能被拖延，或创意缺乏落地。需要从想法回到执行。",
      study: "容易贪图舒适，学习推进较慢。建议用明确计划约束自己。"
    }
  },
  {
    name: "皇帝",
    symbol: "👑",
    upright: {
      love: "感情需要明确规则与责任。稳定关系适合谈未来，暧昧关系则需要确认边界。",
      career: "事业上适合制定制度、争取管理权、承担责任。你的掌控力会提升。",
      study: "学习上需要纪律和结构。建立固定时间表会明显改善结果。"
    },
    reversed: {
      love: "关系中可能出现控制欲、固执或权力不平衡。沟通时需要少一点命令，多一点理解。",
      career: "工作中可能遇到强势人物或规则压力。先稳住基本盘，再寻找突破口。",
      study: "学习计划过于僵硬，导致压力累积。适当调整方法比硬撑更有效。"
    }
  },
  {
    name: "教皇",
    symbol: "📜",
    upright: {
      love: "关系适合走向正式、稳定、被认可的阶段。也可能得到长辈或朋友建议。",
      career: "工作中适合遵循流程、学习经验、进入规范体系。贵人或导师可能出现。",
      study: "非常利于系统学习、考试、证书、课程训练。按标准方法走更稳。"
    },
    reversed: {
      love: "感情可能受到传统观念或外界评价影响。你需要分清自己的感受和他人的期待。",
      career: "工作中可能不适应僵化制度。可以创新，但不要直接对抗规则。",
      study: "学习方法可能不适合你。可以调整路径，不必盲目照搬别人经验。"
    }
  },
  {
    name: "恋人",
    symbol: "💞",
    upright: {
      love: "感情主题强烈，代表吸引、选择与关系确认。你需要听从内心，也要看双方价值观是否一致。",
      career: "工作上有合作机会，也可能面临重要选择。选择与你价值观一致的方向更有利。",
      study: "学习中适合组队、互助、讨论。也需要在多个方向中做出取舍。"
    },
    reversed: {
      love: "关系中可能出现犹豫、三心二意或沟通失衡。关键不是谁对谁错，而是是否愿意共同选择。",
      career: "合作中可能目标不一致。签约、承诺、分工都要写清楚。",
      study: "容易被选择困扰，或者兴趣太多导致分散。先确定优先级。"
    }
  },
  {
    name: "战车",
    symbol: "🐎",
    upright: {
      love: "感情需要主动推进。若你有明确目标，可以通过行动让关系更进一步。",
      career: "事业上进入冲刺期，竞争越强越能激发你的力量。适合争取名额、项目或晋升。",
      study: "学习适合高强度突破。只要目标清晰，短期内能看到明显提升。"
    },
    reversed: {
      love: "关系推进可能太急，或双方方向不一致。先统一节奏，不要单方面用力。",
      career: "工作上容易失控、急躁或多线混乱。需要重新规划优先级。",
      study: "学习动力忽高忽低。建议减少干扰，专注一个阶段目标。"
    }
  },
  {
    name: "力量",
    symbol: "🦁",
    upright: {
      love: "感情需要温柔而坚定的力量。耐心、包容和稳定情绪会带来正向变化。",
      career: "工作中你有能力处理压力，也适合解决复杂人际或长期任务。",
      study: "学习需要持续力。你不是不能做到，而是需要稳定坚持。"
    },
    reversed: {
      love: "你可能压抑情绪，或在关系里失去自信。不要用讨好换取安全感。",
      career: "工作压力让你消耗较大。先恢复状态，再谈突破。",
      study: "容易自我怀疑。建议降低单次任务难度，用小胜利找回信心。"
    }
  },
  {
    name: "隐士",
    symbol: "🕯️",
    upright: {
      love: "感情进入思考期，适合独处、冷静判断。不是没有发展，而是需要更清楚自己的需求。",
      career: "工作上适合沉淀、研究、打磨专业能力。短期不张扬，长期有价值。",
      study: "非常适合复盘、深度阅读、独立钻研。越安静越有收获。"
    },
    reversed: {
      love: "可能有逃避沟通或过度封闭的问题。适当表达真实想法会减少误会。",
      career: "工作中孤立感增强，别一个人扛所有问题。适合寻求专业支持。",
      study: "容易钻牛角尖。建议把问题拆小，并主动请教。"
    }
  },
  {
    name: "命运之轮",
    symbol: "🎡",
    upright: {
      love: "关系可能迎来转折，偶然事件会推动发展。保持开放，变化未必是坏事。",
      career: "工作机会开始流动，可能有新平台、新任务或新合作。顺势而为更有利。",
      study: "学习状态会出现阶段性变化。抓住灵感和机会，可以快速提升。"
    },
    reversed: {
      love: "感情中可能反复循环旧问题。若不改变互动模式，结果也会重复。",
      career: "工作节奏受外部因素影响。不要把所有希望放在运气上，要准备备用方案。",
      study: "学习起伏明显。需要建立稳定机制，而不是只靠状态。"
    }
  },
  {
    name: "正义",
    symbol: "⚖️",
    upright: {
      love: "感情需要诚实与公平。适合把问题说清楚，也适合做出理性决定。",
      career: "工作上适合签约、审核、评估、谈判。你的努力会被更客观地衡量。",
      study: "考试、评分、申请等事务较有利。认真准备会得到相应回报。"
    },
    reversed: {
      love: "关系中可能存在不公平、隐瞒或责任逃避。你需要维护自己的底线。",
      career: "工作中要注意合同、规则和证据。避免口头承诺不落地。",
      study: "学习结果可能受到偏差影响。检查细节，避免因粗心失分。"
    }
  },
  {
    name: "倒吊人",
    symbol: "🪢",
    upright: {
      love: "感情暂时停顿，但停顿是为了换角度。放下控制，反而看得更清楚。",
      career: "工作推进慢，需要等待时机。适合调整策略，而不是硬推。",
      study: "学习遇到瓶颈时，换方法比加时间更有效。"
    },
    reversed: {
      love: "你可能牺牲太多却没有换来改变。需要判断这段关系是否值得继续投入。",
      career: "工作中有无效等待或被动拖延。该行动时不要继续观望。",
      study: "学习上可能假装努力但效率不足。需要直接面对薄弱点。"
    }
  },
  {
    name: "死神",
    symbol: "🦋",
    upright: {
      love: "关系进入转化期，旧模式需要结束。可能是放下过去，也可能是关系升级前的重整。",
      career: "工作上适合结束低效项目、转换赛道、清理旧负担。改变会带来新空间。",
      study: "学习方式需要更新。放弃无效方法，才能真正进步。"
    },
    reversed: {
      love: "你可能舍不得结束旧问题，导致关系卡住。改变不是失去，而是重生的入口。",
      career: "工作中抗拒变化会增加压力。越早调整，越容易掌握主动权。",
      study: "旧习惯拖累学习。需要强制切断干扰源。"
    }
  },
  {
    name: "节制",
    symbol: "🍷",
    upright: {
      love: "感情正在调和，适合慢慢磨合。温和沟通比激烈表达更有效。",
      career: "工作中需要协调资源、平衡节奏。稳定推进会比冒进更好。",
      study: "学习状态适合循序渐进。每天稳定一点，会形成长期优势。"
    },
    reversed: {
      love: "双方节奏不一致，容易一方热一方冷。需要重新找到相处平衡。",
      career: "工作中资源分配不均或节奏失控。先调整流程。",
      study: "学习安排不均衡，可能偏科或作息混乱。需要恢复秩序。"
    }
  },
  {
    name: "恶魔",
    symbol: "⛓️",
    upright: {
      love: "感情中有强烈吸引，但也可能伴随依赖、占有或欲望牵引。要分清喜欢和执念。",
      career: "工作上可能被利益、压力或短期诱惑绑定。谨慎评估代价。",
      study: "学习中容易被娱乐、拖延或比较心困住。需要自律。"
    },
    reversed: {
      love: "你正在看清关系中的束缚，并有机会摆脱不健康模式。",
      career: "有机会脱离高压或不合理安排。适合重新争取主动权。",
      study: "拖延状态有望改善，只要你愿意切断干扰。"
    }
  },
  {
    name: "高塔",
    symbol: "⚡",
    upright: {
      love: "感情中可能出现突然真相或强烈冲突。虽然震动大，但能打破虚假的稳定。",
      career: "工作可能有突发变化，如调整、冲突、计划推翻。保持应变能力很重要。",
      study: "学习计划可能被打乱，或发现基础漏洞。及时修正反而是好事。"
    },
    reversed: {
      love: "危机可能被延后但没有消失。与其逃避，不如主动处理核心问题。",
      career: "你可能已经意识到风险，但还没行动。提前调整能降低损失。",
      study: "问题积累较久，需要系统补漏，不能再拖。"
    }
  },
  {
    name: "星星",
    symbol: "⭐",
    upright: {
      love: "感情有疗愈与希望，适合重新建立信任。单身者可能遇到温柔的缘分。",
      career: "工作上出现长期愿景，适合做规划、品牌、创意和未来型项目。",
      study: "学习状态回暖，信心恢复。适合设立长期目标。"
    },
    reversed: {
      love: "你可能对感情失去信心，或期待过高导致失落。先照顾自己的感受。",
      career: "工作愿景模糊，容易迷茫。需要把梦想拆成可执行步骤。",
      study: "学习动力不足。可以从最容易完成的一项开始恢复信心。"
    }
  },
  {
    name: "月亮",
    symbol: "🌘",
    upright: {
      love: "感情中有暧昧、不安或误解。不要被想象带走，事实比猜测更重要。",
      career: "工作信息复杂，适合谨慎判断。避免在不清楚时做重大决定。",
      study: "学习容易焦虑，尤其对未知结果敏感。需要稳定情绪。"
    },
    reversed: {
      love: "迷雾逐渐散开，真相会显现。你会更清楚自己该如何选择。",
      career: "工作中的不确定性开始减少。适合整理信息，做出判断。",
      study: "焦虑会慢慢下降。复盘错题和知识点会让你找回掌控感。"
    }
  },
  {
    name: "太阳",
    symbol: "☀️",
    upright: {
      love: "感情明朗、积极、充满生命力。适合公开表达、约会、推进关系。",
      career: "工作成果容易被看见，适合展示、汇报、争取认可。",
      study: "学习状态佳，理解力和自信心提升。适合考试和成果展示。"
    },
    reversed: {
      love: "关系中仍有希望，但可能因小误会或自我中心影响体验。多一点体谅。",
      career: "成果尚未完全显现，不要急于否定自己。继续优化表达方式。",
      study: "学习能力不差，但容易骄傲或松懈。保持稳定发挥。"
    }
  },
  {
    name: "审判",
    symbol: "📯",
    upright: {
      love: "感情进入重新评估阶段，可能复合、和解，或做出重要决定。",
      career: "事业上适合总结过去、迎接新阶段。可能有考核、评审、转正或晋升机会。",
      study: "学习成果进入检验期。过去的积累会被看见。"
    },
    reversed: {
      love: "你可能迟迟不愿面对答案。逃避判断只会延长不确定。",
      career: "工作中需要复盘错误，否则容易重复旧问题。",
      study: "学习上要正视薄弱点。承认问题后，进步会更快。"
    }
  },
  {
    name: "世界",
    symbol: "🌍",
    upright: {
      love: "关系趋于完整、成熟，可能进入稳定阶段。单身者也会更清楚自己想要的关系。",
      career: "工作有阶段性完成，适合收尾、发布、交付、拓展更大平台。",
      study: "学习成果圆满，适合总结体系、完成考试或进入下一阶段。"
    },
    reversed: {
      love: "关系差一点完成闭环，可能还有遗憾或未解决的问题。需要把话说完整。",
      career: "项目临近完成但仍有细节拖延。坚持收尾非常关键。",
      study: "学习还差最后一段整合。不要在临门一脚时松懈。"
    }
  }
];

const stepIds = [
  "stepWelcome",
  "stepQuestion",
  "stepShuffle",
  "stepCut",
  "stepDraw",
  "stepSpread",
  "stepReveal",
  "stepSummary"
];

const keywordMap = {
  upright: ["推进", "清晰", "机会", "成长", "稳定", "显化"],
  reversed: ["调整", "阻碍", "延迟", "失衡", "提醒", "修正"]
};

const categoryAdviceLabel = {
  love: {
    focus: "关系互动",
    action: "真诚表达、稳定沟通、观察行动",
    caution: "避免只靠猜测判断关系，也不要因情绪波动做决定。"
  },
  career: {
    focus: "目标推进",
    action: "确认优先级、拆解任务、主动争取资源",
    caution: "避免被临时压力带偏，也要注意沟通和流程细节。"
  },
  study: {
    focus: "学习节奏",
    action: "复盘薄弱点、建立计划、持续练习",
    caution: "避免只靠短期冲刺，稳定执行比焦虑更重要。"
  }
};

function showStep(id) {
  stepIds.forEach(stepId => {
    const el = document.getElementById(stepId);
    if (el) el.classList.toggle("active", stepId === id);
  });
  tarotState.step = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getNeedCount() {
  return spreadMap[tarotState.spread].count;
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, char => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return map[char];
  });
}

function bindChoices(groupId, stateKey) {
  const group = document.getElementById(groupId);
  if (!group) return;

  group.addEventListener("click", event => {
    const btn = event.target.closest(".tarot-choice");
    if (!btn) return;

    group.querySelectorAll(".tarot-choice").forEach(item => {
      item.classList.remove("active");
    });

    btn.classList.add("active");
    tarotState[stateKey] = btn.dataset[stateKey];

    tarotState.confirmed = false;
    const startBtn = document.getElementById("startShuffleBtn");
    const confirmText = document.getElementById("confirmText");
    if (startBtn) startBtn.disabled = true;
    if (confirmText) confirmText.textContent = "问题类型或牌阵已调整，请重新确认问题。";
  });
}

function showToast(message) {
  let toast = document.querySelector(".tarot-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "tarot-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function buildFanCards() {
  const fanStage = document.getElementById("fanStage");
  fanStage.innerHTML = "";

  const total = window.innerWidth <= 720 ? 12 : 18;
  const startAngle = window.innerWidth <= 720 ? -46 : -52;
  const endAngle = window.innerWidth <= 720 ? 46 : 52;

  for (let i = 0; i < total; i++) {
    const card = document.createElement("button");
    card.className = "fan-card";
    card.type = "button";
    card.setAttribute("aria-label", "抽取一张塔罗牌");

    const angle = startAngle + ((endAngle - startAngle) / (total - 1)) * i;
    const offset = (i - total / 2) * (window.innerWidth <= 720 ? 18 : 15);

    card.style.transform = `translateX(${offset - 43}px) rotate(${angle}deg)`;
    card.dataset.index = i;

    card.addEventListener("click", () => drawRandomCard(card));

    fanStage.appendChild(card);
  }

  updateDrawHint();
}

function drawRandomCard(cardButton) {
  const needCount = getNeedCount();

  if (tarotState.selectedCards.length >= needCount) return;

  const usedNames = tarotState.selectedCards.map(item => item.name);
  const availableCards = tarotDeck.filter(card => !usedNames.includes(card.name));
  const card = randomItem(availableCards);
  const orientation = Math.random() > 0.5 ? "upright" : "reversed";

  tarotState.selectedCards.push({
    ...card,
    orientation,
    revealed: false
  });

  if (cardButton) {
    cardButton.disabled = true;
    cardButton.style.opacity = "0.25";
    cardButton.style.pointerEvents = "none";
    cardButton.style.transform += " translateY(-28px)";
  }

  renderDrawnList();
  updateDrawHint();

  if (tarotState.selectedCards.length >= needCount) {
    document.getElementById("finishDrawBtn").disabled = false;
    showToast("抽牌完成，可以进入牌阵。");
  }
}

function updateDrawHint() {
  const needCount = getNeedCount();
  const current = tarotState.selectedCards.length;
  const text = current >= needCount
    ? "抽牌完成。请进入牌阵，准备查看你的专属解读。"
    : `请凭直觉点击牌面抽牌，还需要抽取 ${needCount - current} 张。`;

  document.getElementById("drawHint").textContent = text;
}

function renderDrawnList() {
  const drawnList = document.getElementById("drawnList");
  drawnList.innerHTML = "";

  tarotState.selectedCards.forEach((card, index) => {
    const item = document.createElement("span");
    item.textContent = `第 ${index + 1} 张牌已回应`;
    drawnList.appendChild(item);
  });
}

function renderSpreadStage() {
  const spreadStage = document.getElementById("spreadStage");
  const spreadTitle = document.getElementById("spreadTitle");
  const spread = spreadMap[tarotState.spread];

  spreadTitle.textContent = `布置牌阵：${spread.name}`;
  spreadStage.innerHTML = "";

  tarotState.selectedCards.forEach((card, index) => {
    const slot = document.createElement("div");
    slot.className = "spread-slot";

    slot.innerHTML = `
      <div class="spread-card-back"></div>
      <div class="spread-position-name">${spread.positions[index]}</div>
    `;

    spreadStage.appendChild(slot);
  });
}

function getOrientationText(card) {
  return card.orientation === "upright" ? "正位" : "逆位";
}

function getKeywords(card) {
  const base = keywordMap[card.orientation];
  const nameKeywords = {
    愚者: ["新开始", "冒险", "自由"],
    魔术师: ["行动力", "资源", "表达"],
    女祭司: ["直觉", "秘密", "观察"],
    女皇: ["滋养", "成长", "关系"],
    皇帝: ["秩序", "责任", "掌控"],
    教皇: ["规则", "导师", "传统"],
    恋人: ["选择", "吸引", "价值观"],
    战车: ["推进", "胜利", "目标"],
    力量: ["耐心", "自信", "温柔"],
    隐士: ["沉淀", "独处", "内省"],
    命运之轮: ["转折", "变化", "机会"],
    正义: ["公平", "判断", "规则"],
    倒吊人: ["等待", "换角度", "牺牲"],
    死神: ["结束", "转化", "重生"],
    节制: ["平衡", "调和", "节奏"],
    恶魔: ["束缚", "欲望", "执念"],
    高塔: ["冲击", "风险", "重建"],
    星星: ["希望", "疗愈", "愿景"],
    月亮: ["迷雾", "情绪", "潜意识"],
    太阳: ["明朗", "成功", "生命力"],
    审判: ["复盘", "觉醒", "决定"],
    世界: ["完成", "整合", "阶段成果"]
  };

  return [...(nameKeywords[card.name] || []), ...base].slice(0, 5);
}

function buildRichReading(card, positionName) {
  const orientationText = getOrientationText(card);
  const category = tarotState.category;
  const meaning = card[card.orientation][category];
  const categoryInfo = categoryAdviceLabel[category];
  const keywords = getKeywords(card).join("、");

  const orientationExplain = card.orientation === "upright"
    ? `这张牌以正位出现，说明「${positionName}」位置上的能量较为顺畅，事情存在被推进、被看见或逐步成形的空间。`
    : `这张牌以逆位出现，并不代表坏结果，而是在提醒你：「${positionName}」位置上可能有延迟、回避、失衡或尚未处理好的部分。`;

  const questionExplain = `结合你的问题「${escapeHtml(tarotState.question)}」，${meaning} 这表示你现在不宜只看表面结果，更需要理解事情背后的节奏、动机和现实条件。`;

  const action = `接下来可以围绕「${categoryInfo.focus}」行动：${categoryInfo.action}。如果你能先处理最关键的一处阻碍，后续趋势会更容易打开。`;

  const caution = `${categoryInfo.caution} 尤其当你感到急躁、失望或过度期待时，先停下来确认事实，再做选择。`;

  return {
    keywords,
    orientationExplain,
    questionExplain,
    action,
    caution,
    short: meaning,
    title: `${card.name} · ${orientationText}`
  };
}

function renderRevealStage() {
  const revealStage = document.getElementById("revealStage");
  const spread = spreadMap[tarotState.spread];

  revealStage.innerHTML = "";
  tarotState.revealedCount = 0;
  document.getElementById("goSummaryBtn").disabled = true;

  tarotState.selectedCards.forEach((card, index) => {
    const slot = document.createElement("div");
    slot.className = "reveal-slot";

    const orientationText = getOrientationText(card);
    const rich = buildRichReading(card, spread.positions[index]);
    const isReversed = card.orientation === "reversed";

    slot.innerHTML = `
      <div class="reveal-card" data-index="${index}">
        <div class="reveal-card-inner">
          <div class="reveal-card-face reveal-card-back"></div>
          <div class="reveal-card-face reveal-card-front ${isReversed ? "reversed" : ""}">
            <div>
              <div class="card-symbol">${card.symbol}</div>
              <div class="card-name">${card.name}</div>
              <div class="card-orientation">${orientationText}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="reveal-position-name">${spread.positions[index]}</div>

      <div class="reveal-reading" hidden>
        <strong>${card.name} · ${orientationText}</strong>
        <p><span class="reading-label">关键词：</span>${rich.keywords}</p>
        <p>${rich.short}</p>
        <p>${rich.orientationExplain}</p>
      </div>
    `;

    const revealCard = slot.querySelector(".reveal-card");
    const reading = slot.querySelector(".reveal-reading");

    revealCard.addEventListener("click", () => {
      if (card.revealed) return;

      card.revealed = true;
      revealCard.classList.add("flipped");

      setTimeout(() => {
        reading.hidden = false;
      }, 520);

      tarotState.revealedCount += 1;

      if (tarotState.revealedCount >= tarotState.selectedCards.length) {
        document.getElementById("goSummaryBtn").disabled = false;
        showToast("牌面已全部揭示，可以查看完整总结。");
      }
    });

    revealStage.appendChild(slot);
  });
}

function getToneSummary() {
  const uprightCount = tarotState.selectedCards.filter(card => card.orientation === "upright").length;
  const reversedCount = tarotState.selectedCards.length - uprightCount;

  if (uprightCount > reversedCount) {
    return "整体趋势偏积极，说明这件事存在推进空间。你当前更适合主动沟通、明确目标，并把已经具备的资源利用起来。";
  }

  if (reversedCount > uprightCount) {
    return "整体趋势提醒你先处理阻碍。牌面并不是在否定结果，而是在提示当前仍有情绪、信息、节奏或现实条件需要调整。";
  }

  return "整体趋势呈现平衡状态，机会与挑战并存。你需要同时保持理性判断和行动力。";
}

function getAdvice() {
  const category = tarotState.category;
  const spread = tarotState.spread;

  const adviceMap = {
    love: {
      single: "感情方面，建议你先看清自己的真实需求，再判断对方是否也在用行动回应。不要急着给关系下结论，稳定沟通比反复猜测更重要。",
      three: "感情方面，过去的互动模式会影响现在的判断。未来的关键在于双方是否愿意坦诚表达，并共同调整相处节奏。"
    },
    career: {
      single: "工作方面，建议你把目标拆成可执行步骤。近期适合提升专业度、明确优先级，避免被临时情绪或外界压力带偏。",
      three: "工作方面，过去的积累正在影响现在的位置。未来能否突破，取决于你是否能抓住重点任务，并主动争取资源。"
    },
    study: {
      single: "学业方面，建议先稳定学习节奏，不要只依赖短期冲刺。找到薄弱点后持续练习，会比盲目焦虑更有效。",
      three: "学业方面，过去的基础决定了现在的难点。未来的提升来自复盘、计划和坚持，尤其要重视错题与知识体系整理。"
    }
  };

  return adviceMap[category][spread];
}

function getOpportunityText() {
  const hasUpright = tarotState.selectedCards.some(card => card.orientation === "upright");

  if (hasUpright) {
    return "机会在于你已经拥有一部分可用资源，可能是经验、人脉、表达能力、过去积累或即将出现的窗口。与其等待外界完全明朗，不如先把能推进的部分整理出来。";
  }

  return "机会并没有消失，只是目前更适合从修正和复盘中寻找突破口。先解决小问题，会比直接追求大结果更有效。";
}

function getRiskText() {
  const reversedCards = tarotState.selectedCards.filter(card => card.orientation === "reversed");

  if (reversedCards.length) {
    const names = reversedCards.map(card => card.name).join("、");
    return `风险主要来自「${names}」所提示的逆位能量：可能是拖延、沟通偏差、情绪消耗、节奏失衡或对现实情况判断不足。越早正视，后续越容易掌握主动。`;
  }

  return "风险并不明显，但也不要因为牌面偏顺就忽略细节。保持节奏、确认事实、按计划执行，能让好趋势更稳定。";
}

function getNextStepText() {
  return "接下来 7 天，建议你只选择一件最容易开始、最能改变当前状态的小事去行动。塔罗更像一面镜子，它提醒你看见状态，但真正改变结果的仍然是你的选择与行动。";
}

function renderSummary() {
  const summaryBox = document.getElementById("summaryBox");
  const spread = spreadMap[tarotState.spread];
  const categoryName = categoryMap[tarotState.category];

  const cardHtml = tarotState.selectedCards.map((card, index) => {
    const orientationText = getOrientationText(card);
    const rich = buildRichReading(card, spread.positions[index]);
    const isReversed = card.orientation === "reversed";

    return `
      <div class="summary-section summary-card">
        <div class="summary-card-head">
          <div class="summary-mini-card ${isReversed ? "reversed" : ""}">${card.symbol}</div>
          <div>
            <h3 class="summary-card-title">
              ${spread.positions[index]}：${card.name}
              <span class="orientation-badge ${isReversed ? "reversed" : ""}">${orientationText}</span>
            </h3>
            <div class="summary-card-subtitle">关键词：${rich.keywords}</div>
          </div>
        </div>

        <div class="reading-block">
          <p><span class="reading-label">牌义解释：</span>${rich.short}</p>
          <p><span class="reading-label">结合问题：</span>${rich.questionExplain}</p>
          <p><span class="reading-label">当前提醒：</span>${rich.orientationExplain}</p>
          <p><span class="reading-label">行动建议：</span>${rich.action}</p>
          <p><span class="reading-label">注意事项：</span>${rich.caution}</p>
        </div>
      </div>
    `;
  }).join("");

  summaryBox.innerHTML = `
    <div class="summary-hero">
      <div class="summary-section">
        <h3>你的问题</h3>
        <p>${escapeHtml(tarotState.question)}</p>
      </div>

      <div class="summary-section">
        <h3>占卜方向</h3>
        <p>${categoryName} · ${spread.name}</p>
      </div>
    </div>

    <div class="summary-section">
      <h3>总体趋势</h3>
      <p>${getToneSummary()}</p>
    </div>

    <div class="summary-card-list">
      ${cardHtml}
    </div>

    <div class="summary-hero">
      <div class="summary-section">
        <h3>机会</h3>
        <p>${getOpportunityText()}</p>
      </div>

      <div class="summary-section">
        <h3>风险</h3>
        <p>${getRiskText()}</p>
      </div>
    </div>

    <div class="summary-section">
      <h3>下一步建议</h3>
      <p>${getAdvice()} ${getNextStepText()}</p>
    </div>
  `;
}

function resetTarot() {
  tarotState.step = "stepWelcome";
  tarotState.category = "love";
  tarotState.spread = "single";
  tarotState.question = "";
  tarotState.confirmed = false;
  tarotState.selectedCards = [];
  tarotState.revealedCount = 0;

  document.getElementById("questionInput").value = "";
  document.getElementById("confirmText").textContent = "";
  document.getElementById("startShuffleBtn").disabled = true;
  document.getElementById("finishDrawBtn").disabled = true;
  document.getElementById("finishCutBtn").disabled = true;
  document.getElementById("cutDeck").classList.remove("cut-done");
  document.getElementById("fanStage").innerHTML = "";
  document.getElementById("drawnList").innerHTML = "";

  document.querySelectorAll("#categoryGroup .tarot-choice").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === "love");
  });

  document.querySelectorAll("#spreadGroup .tarot-choice").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.spread === "single");
  });

  showStep("stepWelcome");
}

function buildShareText() {
  const categoryName = categoryMap[tarotState.category];
  const spread = spreadMap[tarotState.spread];

  const cardsText = tarotState.selectedCards.map((card, index) => {
    const orientationText = getOrientationText(card);
    const rich = buildRichReading(card, spread.positions[index]);
    return `${index + 1}. ${spread.positions[index]}：${card.name} · ${orientationText}
关键词：${rich.keywords}
解读：${rich.short}`;
  }).join("\n\n");

  const link = location.href.split("#")[0];

  return `🔮 我的塔罗占卜结果

问题：${tarotState.question}
方向：${categoryName}
牌阵：${spread.name}

${cardsText}

总体趋势：
${getToneSummary()}

机会：
${getOpportunityText()}

风险：
${getRiskText()}

下一步建议：
${getAdvice()} ${getNextStepText()}

来试试你的塔罗占卜：
${link}`;
}

async function copyShareText() {
  const text = buildShareText();

  try {
    await navigator.clipboard.writeText(text);
    showToast("占卜结果已复制，可以分享给好友。");
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("占卜结果已复制。");
  }
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const words = String(text).split("");
  let line = "";
  let lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      lines.push(line);
      line = words[i];

      if (lines.length >= maxLines) break;
    } else {
      line = testLine;
    }
  }

  if (line && lines.length < maxLines) lines.push(line);

  lines.forEach((item, index) => {
    ctx.fillText(item, x, y + index * lineHeight);
  });

  return y + lines.length * lineHeight;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function createShareImage() {
  if (!tarotState.selectedCards.length) {
    showToast("请先完成占卜。");
    return;
  }

  const canvas = document.createElement("canvas");
  const width = 900;
  const height = tarotState.selectedCards.length === 1 ? 1280 : 1580;
  const dpr = 2;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#12091f");
  gradient.addColorStop(0.45, "#221039");
  gradient.addColorStop(1, "#3b0f37");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = i % 5 === 0 ? "rgba(250,204,21,0.45)" : "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.6 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#facc15";
  ctx.font = "700 28px sans-serif";
  ctx.fillText("Tarot Fortune Reading", 60, 84);

  ctx.fillStyle = "#fff7ed";
  ctx.font = "900 58px sans-serif";
  ctx.fillText("我的塔罗占卜结果", 60, 155);

  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "30px sans-serif";
  let y = 220;
  y = wrapCanvasText(ctx, `问题：${tarotState.question}`, 60, y, width - 120, 44, 3) + 28;

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  roundRect(ctx, 50, y, width - 100, 150, 28);
  ctx.fill();

  ctx.fillStyle = "#fef3c7";
  ctx.font = "900 30px sans-serif";
  ctx.fillText("总体趋势", 80, y + 48);

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "28px sans-serif";
  wrapCanvasText(ctx, getToneSummary(), 80, y + 92, width - 160, 40, 2);

  y += 190;

  const spread = spreadMap[tarotState.spread];

  tarotState.selectedCards.forEach((card, index) => {
    const orientationText = getOrientationText(card);
    const rich = buildRichReading(card, spread.positions[index]);
    const isReversed = card.orientation === "reversed";

    ctx.fillStyle = "rgba(255,255,255,0.11)";
    roundRect(ctx, 50, y, width - 100, 255, 30);
    ctx.fill();

    ctx.fillStyle = isReversed ? "#f9a8d4" : "#fde68a";
    roundRect(ctx, 80, y + 36, 108, 156, 18);
    ctx.fill();

    ctx.fillStyle = "#2e1065";
    ctx.font = "50px sans-serif";
    ctx.fillText(card.symbol, 112, y + 125);

    ctx.fillStyle = "#fff7ed";
    ctx.font = "900 34px sans-serif";
    ctx.fillText(`${spread.positions[index]}：${card.name} · ${orientationText}`, 220, y + 62);

    ctx.fillStyle = "#facc15";
    ctx.font = "700 24px sans-serif";
    ctx.fillText(`关键词：${rich.keywords}`, 220, y + 105);

    ctx.fillStyle = "rgba(255,255,255,0.76)";
    ctx.font = "26px sans-serif";
    wrapCanvasText(ctx, rich.short, 220, y + 148, width - 290, 38, 3);

    y += 285;
  });

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  roundRect(ctx, 50, y, width - 100, 190, 30);
  ctx.fill();

  ctx.fillStyle = "#fef3c7";
  ctx.font = "900 30px sans-serif";
  ctx.fillText("下一步建议", 80, y + 52);

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "26px sans-serif";
  wrapCanvasText(ctx, getNextStepText(), 80, y + 96, width - 160, 38, 3);

  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "22px sans-serif";
  ctx.fillText(location.host || "Tarot Reading", 60, height - 60);

  const imageUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `tarot-reading-${Date.now()}.png`;

  try {
    link.click();
    showToast("分享图已生成。");
  } catch (error) {
    window.open(imageUrl, "_blank");
  }
}

function initTarot() {
  bindChoices("categoryGroup", "category");
  bindChoices("spreadGroup", "spread");

  document.getElementById("goQuestionBtn").addEventListener("click", () => {
    showStep("stepQuestion");
  });

  document.getElementById("confirmQuestionBtn").addEventListener("click", () => {
    const question = document.getElementById("questionInput").value.trim();

    if (!question) {
      showToast("请先输入你的占卜问题。");
      return;
    }

    tarotState.question = question;
    tarotState.confirmed = true;

    document.getElementById("confirmText").textContent =
      `已确认：${categoryMap[tarotState.category]} / ${spreadMap[tarotState.spread].name}`;

    document.getElementById("startShuffleBtn").disabled = false;
    showToast("问题已确认，准备开始洗牌。");
  });

  document.getElementById("startShuffleBtn").addEventListener("click", () => {
    if (!tarotState.confirmed) return;
    showStep("stepShuffle");
  });

  document.getElementById("finishShuffleBtn").addEventListener("click", () => {
    showStep("stepCut");
  });

  document.getElementById("cutDeck").addEventListener("click", () => {
    document.getElementById("cutDeck").classList.add("cut-done");
    document.getElementById("finishCutBtn").disabled = false;
  });

  document.getElementById("finishCutBtn").addEventListener("click", () => {
    tarotState.selectedCards = [];
    tarotState.revealedCount = 0;
    document.getElementById("finishDrawBtn").disabled = true;
    buildFanCards();
    showStep("stepDraw");
  });

  document.getElementById("finishDrawBtn").addEventListener("click", () => {
    renderSpreadStage();
    showStep("stepSpread");
  });

  document.getElementById("goRevealBtn").addEventListener("click", () => {
    renderRevealStage();
    showStep("stepReveal");
  });

  document.getElementById("goSummaryBtn").addEventListener("click", () => {
    renderSummary();
    showStep("stepSummary");
  });

  document.getElementById("restartBtn").addEventListener("click", resetTarot);

  const copyBtn = document.getElementById("copyShareBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", copyShareText);
  }

  const imageBtn = document.getElementById("createShareImageBtn");
  if (imageBtn) {
    imageBtn.addEventListener("click", createShareImage);
  }

  const oldShareBtn = document.getElementById("shareBtn");
  if (oldShareBtn) {
    oldShareBtn.addEventListener("click", copyShareText);
  }
}

document.addEventListener("DOMContentLoaded", initTarot);