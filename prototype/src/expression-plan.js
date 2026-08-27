export const STORAGE_KEY = "zhixu-expression-v1";
export const TRACKS = {
  zh: { title: "中文表达", subtitle: "有逻辑，也有温度", levels: ["基础 · 说清楚", "进阶 · 有说服力"], weeks: ["先说结论", "讲好一个故事", "解释与说服", "即兴与迁移"] },
  en: { title: "English speaking", subtitle: "Clarity first. Confidence follows.", levels: ["A2 · 日常沟通", "B1 · 连贯表达", "B2 · 深入讨论"], weeks: ["Everyday confidence", "Tell your story", "Explain your thinking", "Think on your feet"] },
};

// Four separate weeks of concrete speaking tasks, not recycled daily placeholders.
const topics = {
  zh: [
    ["一分钟介绍自己", "向新同事介绍你正在学习什么，以及为什么。", "身份 → 当前关注 → 一个具体例子", "最近我在学习……因为我想解决……"],
    ["讲清今天的优先级", "今天只推进一件重要的事，你选什么？为什么？", "结论 → 两个理由 → 下一步", "我今天最重要的一件事是……"],
    ["把一本书讲给朋友听", "选择最近读过的一段，讲出一个观点和你的理解。", "观点 → 自己的解释 → 生活中的应用", "这段内容改变了我对……的理解。"],
    ["说清一个工作进展", "用一分钟汇报一项真实或模拟项目的进展。", "已完成 → 当前阻碍 → 需要支持", "目前已经完成……接下来卡在……"],
    ["描述一次小小的改进", "介绍一个能让日常生活更顺畅的小习惯。", "原来的问题 → 新做法 → 可观察的变化", "以前我常常……现在我尝试……"],
    ["把复杂概念讲简单", "向不了解知识库的人解释它有什么用，避免术语。", "一句话定义 → 比喻 → 使用场景", "你可以把知识库想象成……"],
    ["第一周复述挑战", "重新录练自我介绍，把冗余信息删到只剩三个重点。", "我是谁 → 我在做什么 → 我能贡献什么", "如果只用三句话介绍我……"],
    ["一次困难的选择", "讲述一次你在两个选择之间犹豫的经历。", "背景 → 选择 → 原因 → 结果", "当时我面临两个选择……"],
    ["一次出错的经历", "讲一次小失误，重点不是自责，而是修正过程。", "场景 → 问题 → 行动 → 学到什么", "有一次我以为……但实际……"],
    ["一次有效的合作", "讲述你如何和别人共同解决一个问题。", "共同目标 → 分歧 → 协调 → 结果", "我们当时共同想解决……"],
    ["向朋友推荐一本书", "用一个真实的阅读片段解释为什么值得读。", "适合谁 → 故事片段 → 推荐理由", "如果你最近也在困惑……我会推荐……"],
    ["一次认知改变", "讲一个让你改变原有想法的经历。", "原先相信 → 新证据 → 新看法", "我以前一直以为……直到……"],
    ["讲好一件普通小事", "用具体细节讲述今天一个值得记住的瞬间。", "场景细节 → 发生了什么 → 我的感受", "今天有一个很小的瞬间……"],
    ["两分钟成长故事", "选本周一段故事，补充细节、减少背景铺垫。", "冲突开场 → 关键行动 → 变化", "最难的那一刻是……"],
    ["提出一个改进建议", "向同事提出一次会议或流程的改进方案。", "建议 → 当前成本 → 方案 → 试行办法", "我建议先试行……理由是……"],
    ["礼貌表达不同意见", "对方希望立刻上线，你认为需要先测试，如何表达？", "承认目标 → 说明担忧 → 提供替代方案", "我理解我们希望尽快……同时我担心……"],
    ["向新人讲清操作方法", "教一个新人用三步整理一份读书笔记。", "目标 → 三个步骤 → 验收标准", "做完这三步，你应该能……"],
    ["争取一项资源", "为一个学习或工作项目争取一小时时间支持。", "目标 → 价值 → 具体请求 → 回报", "我希望申请……这能帮助我们……"],
    ["解释取舍", "说明为什么暂时不接一个新任务。", "当前承诺 → 影响 → 可行时间", "为了保证……的质量，我建议……"],
    ["面对质疑", "别人说你的计划不现实，请用证据而非情绪回应。", "澄清质疑 → 证据 → 风险控制", "你担心的是……对吗？我的依据是……"],
    ["三分钟微型提案", "提出一个能在一周内验证的个人成长实验。", "问题 → 假设 → 行动 → 检验方式", "我想用一周时间验证……"],
    ["三十秒即兴总结", "用三十秒说出今天最重要的一个收获。", "收获 → 例子 → 下次怎么做", "今天我最重要的收获是……"],
    ["应对临时追问", "介绍一个计划，再请教练连续追问你的依据。", "简答结论 → 支撑依据 → 确认理解", "我的判断是……主要依据有……"],
    ["给不同听众讲同件事", "分别向朋友和专业同事解释你的知识库项目。", "听众需求 → 调整措辞 → 保留核心", "如果向朋友介绍，我会说……"],
    ["有分寸地给反馈", "对一个反复迟到的合作伙伴提出具体反馈。", "事实 → 影响 → 请求 → 邀请回应", "最近两次约定中……这影响了……"],
    ["讲清不确定性", "汇报一个尚未验证的想法，区分事实与推测。", "已知 → 未知 → 验证计划", "目前能确认的是……还需要验证……"],
    ["压力下的简洁表达", "模拟面试：为什么你适合承担一个新任务？", "直接回答 → 一条证据 → 对任务的贡献", "我认为我适合，因为……"],
    ["我的成长分享", "做一次三分钟分享：这四周的表达改变了什么？", "起点 → 两个变化 → 实例 → 下一阶段", "四周前我在表达上最困扰的是……"],
  ],
  en: [
    ["Introduce yourself", "Introduce yourself to a new teammate and mention one learning goal.", "Who I am → what I do → what I am learning", "Hi, I'm Wesley. Recently, I've been learning…"],
    ["My daily routine", "Describe a typical morning and one habit you want to improve.", "First → then → one change", "Most mornings, I start by…"],
    ["A place I enjoy", "Recommend a quiet place to read or work.", "Where → what it is like → why I like it", "One place I really enjoy is…"],
    ["Ask for help", "Ask a colleague for help with a task you do not understand.", "Context → specific question → thanks", "Could you help me understand how to…?"],
    ["Make a plan", "Arrange a short study session with a friend.", "Purpose → time → alternative", "Would you like to practise with me…?"],
    ["Explain a preference", "Explain whether you prefer reading on paper or on a screen.", "Preference → reason → example", "I prefer… because…"],
    ["My first-week recap", "Repeat your introduction and add a clear example of your interests.", "Introduction → example → learning goal", "This week, I realised that…"],
    ["A small achievement", "Tell a story about something you managed to finish recently.", "Situation → action → result", "Recently, I managed to…"],
    ["A problem I solved", "Describe a small problem and how you solved it.", "Problem → steps → lesson", "At first, I didn't know how to…"],
    ["A book that helped", "Explain one idea from a book without quoting long passages.", "Book → idea → personal example", "One useful idea I took from this book is…"],
    ["A memorable conversation", "Describe a conversation that changed your perspective.", "Who → what happened → what changed", "I once had a conversation with…"],
    ["An unexpected change", "Explain what happened when a plan did not work out.", "Original plan → change → response", "I was planning to… but…"],
    ["Working with someone", "Tell a story about collaborating with another person.", "Shared goal → my role → outcome", "We were trying to… My role was to…"],
    ["A two-minute story", "Retell one story from this week with a clearer beginning and ending.", "Hook → key event → reflection", "The most challenging part was…"],
    ["Give a project update", "Give a concise update on a real or imaginary project.", "Done → next → blocker", "So far, I've completed… Next, I plan to…"],
    ["Explain a simple process", "Teach a beginner how you organise a reading note.", "Goal → three steps → check", "There are three simple steps…"],
    ["Make a suggestion", "Suggest one way to make a team meeting more useful.", "Suggestion → benefit → trial", "One thing we could try is…"],
    ["Disagree politely", "A teammate wants to skip testing. Explain your concern politely.", "Acknowledge → concern → alternative", "I see your point. My concern is…"],
    ["Compare two options", "Compare two ways of learning English and recommend one for you.", "Criteria → comparison → choice", "Both options have benefits, but…"],
    ["Ask for clarification", "Clarify a vague request before agreeing to do it.", "Restate → question → confirm", "Just to make sure I understand…"],
    ["Pitch a learning experiment", "Propose a one-week learning experiment and explain how to evaluate it.", "Problem → experiment → success measure", "I'd like to test whether…"],
    ["Think on your feet", "Answer: what would you learn if you had an extra hour each day?", "Answer → reason → example", "If I had an extra hour, I would…"],
    ["Handle follow-up questions", "Describe your project and invite the coach to challenge your assumptions.", "Short answer → evidence → check", "That's a good question. My main reason is…"],
    ["Adapt to your audience", "Explain a knowledge base first to a friend, then to a colleague.", "Audience → simple explanation → useful detail", "In simple terms, it helps you…"],
    ["Give constructive feedback", "Give a teammate feedback about a missed deadline without blaming them.", "Observation → impact → request", "I noticed that… Could we agree on…?"],
    ["Discuss uncertainty", "Explain an idea you are still testing without overstating your confidence.", "Known → uncertain → next test", "Based on what we know so far…"],
    ["A practice interview", "Answer: tell me about a challenge and what you learned from it.", "Situation → action → result → reflection", "A challenge that taught me a lot was…"],
    ["My progress presentation", "Give a three-minute talk about your learning progress and next steps.", "Starting point → change → evidence → next goal", "Over the past four weeks, I've become more…"],
  ],
};

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function dayNumber(start, today = dateKey()) {
  const serial = (key) => { const [y,m,d] = key.split("-").map(Number); return Date.UTC(y,m-1,d); };
  const diff = Math.floor((serial(today)-serial(start))/86400000);
  return Number.isFinite(diff) ? Math.min(28,Math.max(1,diff+1)) : 1;
}
export function lessonFor(language, day) {
  const number = Math.min(28,Math.max(1,Math.trunc(Number(day)) || 1));
  const [title, task, outline, opening] = topics[language][number-1];
  const week = Math.ceil(number/7);
  return { day:number,week,title,task,outline,opening,focus:TRACKS[language].weeks[week-1],seconds:[60,120,150,180][week-1] };
}
export function coachPrompt(language, level, lesson) {
  const shared = `今天是我的第 ${lesson.day} 次训练，第 ${lesson.week} 周重点：${lesson.focus}。\n话题：${lesson.title}\n任务：${lesson.task}\n建议结构：${lesson.outline}\n第一轮目标：约 ${lesson.seconds} 秒，总练习约 10 分钟。\n请按以下流程带练：\n1. 先用一个简短问题开场，一次只问一个问题，让我自己组织语言，不要先给整篇范文。\n2. 让我说完；我说“说完了 / I'm done”再反馈。如果我停顿，给我思考时间。\n3. 只选最影响沟通的 3 个问题，逐条给出“我的原话 → 更好说法 → 原因”，不要凭空编造我的原话。\n4. 围绕内容追问一次，然后让我用更好的结构重新说一遍。\n5. 最后对比两次真实表现，给一个明天的练习重点，并输出可复制的纠错摘要。不要虚构分数或保证进步。\n如果没有收到实际音频，不要推断或评价发音、语调、停顿；请说明仅能分析文字。不要以口音是否像母语者为唯一标准。`;
  return language === "zh"
    ? `你是我的中文口头表达教练。我的训练阶段：${level}。请用中文自然对话，重点纠正逻辑跳跃、冗长、口头禅和不清楚的措辞，在清晰基础上保持我自己的表达风格。\n${shared}`
    : `You are my English speaking coach. My current level is ${level}. Speak mainly in English, with short, level-appropriate sentences. Explain difficult corrections briefly in Chinese when needed. Prioritise intelligibility, natural phrasing, grammar and coherent ideas, not accent imitation. Ask one question at a time.\n${shared}`;
}
export function isComplete(record) {
  return ["original","correction","takeaway"].every((field) => Boolean(record?.[field]?.trim()));
}
export function emptyTraining(today = dateKey()) {
  return { language:"zh", tracks:Object.fromEntries(Object.keys(TRACKS).map((key) => [key,{ start:key === "zh" ? today : null,level:TRACKS[key].levels[0],records:{} }])) };
}
export function parseTraining(raw) {
  if (!raw) return emptyTraining();
  const value = JSON.parse(raw);
  if (!value || !TRACKS[value.language] || !value.tracks) throw new Error("Invalid training data");
  for (const language of Object.keys(TRACKS)) {
    const track = value.tracks[language];
    if (!track || (track.start !== null && !/^\d{4}-\d{2}-\d{2}$/.test(track.start)) || !TRACKS[language].levels.includes(track.level) || !track.records || typeof track.records !== "object" || Array.isArray(track.records)) throw new Error("Invalid track data");
    for (const [day,record] of Object.entries(track.records)) {
      if (!/^([1-9]|1[0-9]|2[0-8])$/.test(day) || !record || typeof record !== "object" || ["original","correction","takeaway"].some(field => record[field] !== undefined && typeof record[field] !== "string")) throw new Error("Invalid practice record");
    }
  }
  return value;
}

export function notesMarkdown(state, today = dateKey()) {
  const lines = ["# 我的表达训练记录",`导出日期：${today}`,"仅包含手动填写的笔记，不包含语音录音。",""];
  for (const [key,details] of Object.entries(state.tracks)) {
    lines.push(`## ${TRACKS[key].title}`,`阶段：${details.level}`,`开始日期：${details.start || "尚未开始"}`,"");
    for (const [number,item] of Object.entries(details.records).sort(([a],[b])=>Number(a)-Number(b))) {
      lines.push(`### Day ${number} · ${lessonFor(key,number).title}`,`状态：${item.completedAt?"已完成":"草稿"}`,`完成时间：${item.completedAt||"—"}`,`原表达：\n${item.original||""}`,`教练纠错：\n${item.correction||""}`,`重练收获：\n${item.takeaway||""}`,"");
    }
  }
  return lines.join("\n\n");
}
