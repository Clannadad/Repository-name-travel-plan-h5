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
  love: "爱情感情",
  career: "工作事业",
  study: "学业考试",
  wealth: "财运金钱",
  relationship: "人际关系",
  growth: "个人成长",
  decision: "选择决策",
  fortune: "近期运势",
  health: "身心状态"
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

const categoryAdviceLabel = {
  love: {
    focus: "关系互动",
    action: "真诚表达、稳定沟通、观察对方行动与自己的真实感受",
    caution: "避免只靠猜测判断关系，也不要因一时情绪做决定。",
    single: "感情方面，建议你先看清自己的真实需求，再判断对方是否也在用行动回应。",
    three: "感情方面，过去的互动模式会影响现在的判断。未来的关键在于双方是否愿意坦诚表达，并共同调整相处节奏。"
  },
  career: {
    focus: "目标推进",
    action: "确认优先级、拆解任务、主动争取资源并稳定交付",
    caution: "避免被临时压力带偏，也要注意沟通、流程和结果复盘。",
    single: "工作方面，建议你把目标拆成可执行步骤。近期适合提升专业度、明确优先级。",
    three: "工作方面，过去的积累正在影响现在的位置。未来能否突破，取决于你是否能抓住重点任务并主动争取资源。"
  },
  study: {
    focus: "学习节奏",
    action: "复盘薄弱点、建立计划、持续练习并减少干扰",
    caution: "避免只靠短期冲刺，稳定执行比焦虑更重要。",
    single: "学业方面，建议先稳定学习节奏，不要只依赖短期冲刺。",
    three: "学业方面，过去的基础决定了现在的难点。未来的提升来自复盘、计划和坚持。"
  },
  wealth: {
    focus: "收入、支出与资源配置",
    action: "梳理现金流、控制非必要消费、评估机会成本，并谨慎推进投资或合作",
    caution: "避免冲动消费、盲目跟风和高估短期收益。",
    single: "财运方面，建议先稳住现金流，再考虑增长机会。近期重点是看清风险与收益是否匹配。",
    three: "财运方面，过去的消费、收入结构或资源选择正在影响现在。未来的关键在于预算管理、风险控制和长期积累。"
  },
  relationship: {
    focus: "社交互动与边界感",
    action: "主动澄清误会、筛选值得投入的关系，并保持温和但明确的边界",
    caution: "避免过度讨好、情绪化回应，或让他人的评价影响你的判断。",
    single: "人际关系方面，建议你先分清谁是真正支持你的人，谁只是消耗你的注意力。",
    three: "人际关系方面，过去的沟通方式会影响当前氛围。未来能否改善，取决于你是否能表达边界并减少内耗。"
  },
  growth: {
    focus: "自我认知与长期成长",
    action: "复盘旧模式、建立新习惯、给自己稳定的成长空间",
    caution: "避免急于证明自己，也不要因为短期停滞就否定长期价值。",
    single: "个人成长方面，建议你把注意力从结果焦虑转向稳定行动。真正的突破来自持续调整。",
    three: "个人成长方面，过去的经历正在塑造现在的你。未来的关键是看见旧模式，并主动选择新的应对方式。"
  },
  decision: {
    focus: "判断、取舍与后果承担",
    action: "列出选项利弊、确认核心价值、设置截止时间，并为选择承担后续行动",
    caution: "避免拖延、反复比较，或把决定完全交给外界评价。",
    single: "选择决策方面，建议你先明确最重要的判断标准，再看哪个选项更符合长期利益。",
    three: "选择决策方面，过去的信息会影响现在的犹豫。未来的关键是做出取舍，而不是追求完全没有风险的答案。"
  },
  fortune: {
    focus: "近期节奏与整体趋势",
    action: "抓住可推进的小机会、调整状态、减少无效消耗",
    caution: "避免把短期波动放大成最终结果，保持观察与行动并行。",
    single: "近期运势方面，建议你关注当下最容易启动的一件事。小范围推进会带来整体状态回暖。",
    three: "近期运势方面，过去的状态正在过渡到新的阶段。未来的趋势取决于你是否能顺势调整节奏。"
  },
  health: {
    focus: "身心能量与生活节律",
    action: "改善作息、降低压力源、关注情绪与身体信号，必要时寻求专业帮助",
    caution: "避免长期透支、忽视身体提醒，或用拖延掩盖真实压力。",
    single: "身心状态方面，建议你先恢复基础节律。睡眠、饮食、运动和情绪稳定比硬撑更重要。",
    three: "身心状态方面，过去的透支可能影响现在。未来需要通过规律作息和压力管理逐步恢复。"
  }
};

const tarotDeck = [
  {
    name: "愚者",
    symbol: "🌱",
    keywords: ["新开始", "冒险", "自由"],
    upright: "新的阶段正在开启，你会遇到轻松、未知但充满可能性的机会。适合尝试，但需要保留基本判断。",
    reversed: "当前容易冲动、准备不足或逃避现实细节。先补齐信息，再开始行动会更稳。"
  },
  {
    name: "魔术师",
    symbol: "✨",
    keywords: ["行动力", "资源", "表达"],
    upright: "你拥有把想法落地的资源与能力。只要主动表达、整合条件，事情就有机会推进。",
    reversed: "资源没有被有效使用，或存在沟通偏差、过度包装的问题。需要回到真实能力与实际行动。"
  },
  {
    name: "女祭司",
    symbol: "🌙",
    keywords: ["直觉", "秘密", "观察"],
    upright: "直觉和隐藏信息很重要。暂时不必急着给答案，观察、沉淀和收集线索会更有利。",
    reversed: "你可能忽略了内在感受，或被模糊信息困住。建议把猜测转化为确认，把感受转化为表达。"
  },
  {
    name: "女皇",
    symbol: "🌹",
    keywords: ["滋养", "成长", "丰盛"],
    upright: "事情处在滋养和成长阶段，适合稳定投入、耐心培育。温和持续会带来更好的结果。",
    reversed: "可能存在过度付出、期待回报或停留在舒适区的问题。需要重新平衡投入与产出。"
  },
  {
    name: "皇帝",
    symbol: "👑",
    keywords: ["秩序", "责任", "掌控"],
    upright: "秩序、规则和责任是当前关键。建立结构、明确边界，会让你重新掌握主动权。",
    reversed: "控制欲、僵化规则或权力不平衡可能带来压力。需要少一点强硬，多一点弹性。"
  },
  {
    name: "教皇",
    symbol: "📜",
    keywords: ["规则", "导师", "传统"],
    upright: "适合遵循经验、获得指导、进入更稳定的体系。来自专业人士或长辈的建议值得参考。",
    reversed: "旧方法未必适合你。可以调整路径，但不要为了反叛规则而忽略现实限制。"
  },
  {
    name: "恋人",
    symbol: "💞",
    keywords: ["选择", "吸引", "价值观"],
    upright: "选择与价值观一致性成为核心。你需要听见内心，也要观察双方目标是否一致。",
    reversed: "犹豫、失衡或目标不一致会造成内耗。关键不是谁对谁错，而是是否愿意共同选择。"
  },
  {
    name: "战车",
    symbol: "🐎",
    keywords: ["推进", "胜利", "目标"],
    upright: "目标明确时，行动力会显著增强。适合冲刺、争取、突破阻碍。",
    reversed: "节奏可能失控，或方向不一致导致消耗。需要重新整理优先级，再继续前进。"
  },
  {
    name: "力量",
    symbol: "🦁",
    keywords: ["耐心", "自信", "温柔"],
    upright: "温柔而坚定的力量正在发挥作用。耐心、稳定情绪和持续坚持会带来正向变化。",
    reversed: "你可能压抑情绪或失去自信。先恢复状态，不要用硬撑代替真正的力量。"
  },
  {
    name: "隐士",
    symbol: "🕯️",
    keywords: ["沉淀", "内省", "独处"],
    upright: "适合独处、复盘、深入思考。短期看似缓慢，但长期会帮助你看清真正方向。",
    reversed: "过度封闭或逃避沟通可能让问题变复杂。适当寻求支持，会减少不必要的孤立感。"
  },
  {
    name: "命运之轮",
    symbol: "🎡",
    keywords: ["转折", "变化", "机会"],
    upright: "局势正在流动，转机可能出现。顺势而为，比强行控制更有利。",
    reversed: "事情可能反复循环，或受外部因素影响。不要只依赖运气，需要准备备用方案。"
  },
  {
    name: "正义",
    symbol: "⚖️",
    keywords: ["公平", "判断", "规则"],
    upright: "理性、公平和事实依据很重要。适合做判断、谈规则、确认责任。",
    reversed: "可能存在不公平、隐瞒或判断偏差。注意证据、边界和具体承诺。"
  },
  {
    name: "倒吊人",
    symbol: "🪢",
    keywords: ["等待", "换角度", "暂停"],
    upright: "暂时停顿不是失败，而是提醒你换一个角度。放下控制，反而更容易看清答案。",
    reversed: "可能存在无效等待或过度牺牲。该行动时不要继续拖延，也不要把自己困在旧位置。"
  },
  {
    name: "死神",
    symbol: "🦋",
    keywords: ["结束", "转化", "重生"],
    upright: "旧模式需要结束，新的空间才会出现。改变虽然不轻松，但有助于真正更新。",
    reversed: "你可能抗拒变化，导致问题卡住。越早清理旧负担，越容易重新开始。"
  },
  {
    name: "节制",
    symbol: "🍷",
    keywords: ["平衡", "调和", "节奏"],
    upright: "稳定、协调和耐心是关键。慢慢磨合、持续调整，会比冒进更有效。",
    reversed: "节奏失衡、资源分配不均或冷热不定可能影响结果。需要重新找回秩序。"
  },
  {
    name: "恶魔",
    symbol: "⛓️",
    keywords: ["束缚", "欲望", "执念"],
    upright: "你可能被某种欲望、压力或执念绑定。需要分清真正需要和短期诱惑。",
    reversed: "你正在看清束缚，并有机会摆脱不健康模式。主动切断消耗源会很重要。"
  },
  {
    name: "高塔",
    symbol: "⚡",
    keywords: ["冲击", "风险", "重建"],
    upright: "突发变化可能打破旧结构。虽然震动大，但也会让隐藏问题浮出水面。",
    reversed: "风险已经被你察觉，但可能还未处理。提前调整能降低损失。"
  },
  {
    name: "星星",
    symbol: "⭐",
    keywords: ["希望", "疗愈", "愿景"],
    upright: "希望与疗愈正在出现。适合重新建立信心，规划长期方向。",
    reversed: "你可能暂时失去信心，或期待过高导致失落。先把目标拆成可完成的小步骤。"
  },
  {
    name: "月亮",
    symbol: "🌘",
    keywords: ["迷雾", "情绪", "潜意识"],
    upright: "信息不完全清晰，情绪和想象容易放大不安。事实比猜测更重要。",
    reversed: "迷雾正在散开，真相会逐渐显现。适合整理信息，并做出更清楚的判断。"
  },
  {
    name: "太阳",
    symbol: "☀️",
    keywords: ["明朗", "成功", "生命力"],
    upright: "局势更明朗，积极能量增强。适合表达、展示、推进和获得认可。",
    reversed: "事情仍有希望，但可能受到小误会、自我中心或松懈影响。需要继续稳定发挥。"
  },
  {
    name: "审判",
    symbol: "📯",
    keywords: ["复盘", "觉醒", "决定"],
    upright: "进入重新评估与重要决定阶段。过去的积累会被看见，也适合开启新阶段。",
    reversed: "你可能迟迟不愿面对答案。逃避判断只会延长不确定。"
  },
  {
    name: "世界",
    symbol: "🌍",
    keywords: ["完成", "整合", "成果"],
    upright: "阶段性完成与整合正在发生。适合收尾、总结、交付，并进入更成熟的新阶段。",
    reversed: "距离完成还差最后一段。不要在临门一脚时松懈，细节收尾非常关键。"
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

  const isMobile = window.innerWidth <= 720;
  const total = isMobile ? 12 : 18;
  const startAngle = isMobile ? -46 : -52;
  const endAngle = isMobile ? 46 : 52;

  for (let i = 0; i < total; i++) {
    const card = document.createElement("button");
    card.className = "fan-card";
    card.type = "button";
    card.setAttribute("aria-label", "抽取一张塔罗牌");

    const angle = startAngle + ((endAngle - startAngle) / (total - 1)) * i;
    const offset = (i - total / 2) * (isMobile ? 18 : 15);

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
  const base = keywordMap[card.orientation] || [];
  return [...card.keywords, ...base].slice(0, 5);
}

function getCategoryMeaning(card) {
  const category = tarotState.category;
  const orientationText = card.orientation === "upright" ? card.upright : card.reversed;

  const categoryPrefix = {
    love: "放在爱情感情中，这张牌提醒你关注双方的真实互动、情绪回应与关系边界。",
    career: "放在工作事业中，这张牌提醒你关注目标、责任、资源与执行节奏。",
    study: "放在学业考试中，这张牌提醒你关注学习方法、专注度、复盘与长期积累。",
    wealth: "放在财运金钱中，这张牌提醒你关注收入结构、支出习惯、风险控制与资源配置。",
    relationship: "放在人际关系中，这张牌提醒你关注沟通方式、社交边界、信任与互相支持。",
    growth: "放在个人成长中，这张牌提醒你关注旧模式、自我认知、内在力量与长期改变。",
    decision: "放在选择决策中，这张牌提醒你关注核心标准、选项代价、长期影响与行动责任。",
    fortune: "放在近期运势中，这张牌提醒你关注整体节奏、机会窗口、状态调整与短期变化。",
    health: "放在身心状态中，这张牌提醒你关注休息、压力、情绪能量与生活节律。"
  };

  return `${categoryPrefix[category]}${orientationText}`;
}

function buildRichReading(card, positionName) {
  const orientationText = getOrientationText(card);
  const categoryInfo = categoryAdviceLabel[tarotState.category];
  const keywords = getKeywords(card).join("、");
  const meaning = getCategoryMeaning(card);

  const orientationExplain = card.orientation === "upright"
    ? `这张牌以正位出现，说明「${positionName}」位置上的能量较为顺畅，事情存在被推进、被看见或逐步成形的空间。`
    : `这张牌以逆位出现，并不代表坏结果，而是在提醒你：「${positionName}」位置上可能有延迟、回避、失衡或尚未处理好的部分。`;

  const questionExplain = `结合你的问题「${escapeHtml(tarotState.question)}」，这表示你现在不宜只看表面结果，更需要理解事情背后的节奏、动机和现实条件。`;

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
  return categoryAdviceLabel[category][spread];
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
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("占卜结果已复制。");
  }
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const chars = String(text).split("");
  let line = "";
  const lines = [];

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      lines.push(line);
      line = chars[i];

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

  /*
    修复分享图 footer 安全区：
    1. 高度动态计算，不再用过紧的固定高度。
    2. 底部预留 footerSafeArea，避免网址被系统分享裁切。
    3. URL 绘制在安全区上方。
  */
  const headerHeight = 260;
  const trendHeight = 160;
  const cardBlockHeight = 285;
  const adviceHeight = 190;
  const footerSafeArea = 130;
  const verticalPadding = 70;

  const height = headerHeight
    + trendHeight
    + tarotState.selectedCards.length * cardBlockHeight
    + adviceHeight
    + footerSafeArea
    + verticalPadding;

  const dpr = Math.max(2, window.devicePixelRatio || 2);

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

  for (let i = 0; i < 150; i++) {
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

    y += cardBlockHeight;
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

  const footerTop = height - footerSafeArea;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, 50, footerTop, width - 100, 72, 24);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.66)";
  ctx.font = "22px sans-serif";
  const urlText = location.href.split("#")[0];
  wrapCanvasText(ctx, urlText, 80, footerTop + 44, width - 160, 30, 1);

  ctx.fillStyle = "rgba(250,204,21,0.75)";
  ctx.font = "700 20px sans-serif";
  ctx.fillText("扫码或访问链接，生成你的塔罗占卜", 80, footerTop + 95);

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