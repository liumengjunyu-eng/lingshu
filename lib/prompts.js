/**
 * 灵枢 · AI 报告 Prompt 模板
 * 基于五行体质分析，生成温暖、可执行、有典籍依据的调理建议
 */

// 五行调理基础方案（来自古籍）
const WUXING_SUGGESTIONS = {
  '木': {
    color: '绿色',
    direction: '东方',
    food: '菠菜、芹菜、青柠',
    advice: '早晨5-7点（卯时）起床运动，肝经当令时深呼吸',
    classic: '《黄帝内经·素问》：「东方生风，风生木，木生酸，酸生肝。」',
    emotion: '怒伤肝，宜保持心情舒畅，遇事不急'
  },
  '火': {
    color: '红色',
    direction: '南方',
    food: '红枣、番茄、枸杞',
    advice: '中午11-13点（午时）心经当令，宜小憩15分钟',
    classic: '《黄帝内经·素问》：「南方生热，热生火，火生苦，苦生心。」',
    emotion: '喜伤心，宜保持情绪平稳，不可大喜大悲'
  },
  '土': {
    color: '黄色',
    direction: '中央',
    food: '小米、南瓜、山药',
    advice: '饭后散步20分钟，脾经当令时（9-11点）不宜久坐',
    classic: '《黄帝内经·素问》：「中央生湿，湿生土，土生甘，甘生脾。」',
    emotion: '思伤脾，宜减少过度思虑，饭后放松'
  },
  '金': {
    color: '白色',
    direction: '西方',
    food: '百合、银耳、雪梨',
    advice: '凌晨3-5点（寅时）肺经当令，宜深睡；多做深呼吸',
    classic: '《黄帝内经·素问》：「西方生燥，燥生金，金生辛，辛生肺。」',
    emotion: '悲伤肺，宜保持乐观，不宜过度悲伤'
  },
  '水': {
    color: '黑色',
    direction: '北方',
    food: '黑豆、黑芝麻、海带',
    advice: '下午17-19点（酉时）肾经当令，宜静坐养肾；保证睡眠',
    classic: '《黄帝内经·素问》：「北方生寒，寒生水，水生咸，咸生肾。」',
    emotion: '恐伤肾，宜保持安定，避免过度紧张'
  }
};

// 构建中文版 Prompt
function buildPrompt(name, gender, birthDate, weakest, suggestion) {
  return `你是一位温和、睿智的人生健康规划师，精通中医五行理论和传统文化。用户刚刚完成了五行体质分析，希望得到一份温暖、可执行的调理建议。

用户信息：
- 姓名：${name}
- 性别：${gender}
- 出生日期：${birthDate}
- 五行体质分析结果：${weakest}元素偏弱

基础调理方案（来自古籍）：
- 幸运色：${suggestion.color}
- 有利方位：${suggestion.direction}
- 推荐食物：${suggestion.food}
- 核心建议：${suggestion.advice}
- 情绪提醒：${suggestion.emotion}
- 经典出处：${suggestion.classic}

请根据以上信息，生成一份个性化的调理建议。要求：
1. 语气像一位懂你的朋友，温暖、鼓励、不评判。不是算命，是帮用户优化生活
2. 包含3个具体的、今天就能做的行动建议
3. 融入典籍原文作为结尾，并解释其含义
4. 总字数控制在400-500字
5. 不要用"首先其次最后"这种AI连接词
6. 不要面面俱到，聚焦最重要的3个建议

格式要求：用markdown格式，分小标题：
「🧘 今日寄语」— 一句话总结用户当前状态
「🌿 饮食调理」— 具体吃什么，为什么
「🏃 运动建议」— 具体做什么，什么时候做
「📜 经典启示」— 引用典籍原文+解读`;
}

// 构建英文版 Prompt
function buildPromptEn(name, gender, birthDate, weakest, suggestion) {
  return `You are a warm, wise wellness advisor with deep knowledge of Traditional Chinese Medicine and Five Elements (Wu Xing) philosophy. The user has just completed their Five Elements analysis and wants actionable, personalized advice.

User Info:
- Name: ${name}
- Gender: ${gender}
- Birth Date: ${birthDate}
- Analysis Result: ${weakest} element is weakest

Base Recommendations (from classical texts):
- Lucky Color: ${suggestion.color}
- Favorable Direction: ${suggestion.direction}
- Recommended Foods: ${suggestion.food}
- Core Advice: ${suggestion.advice}
- Emotional Reminder: ${suggestion.emotion}
- Classic Source: ${suggestion.classic}

Generate a personalized wellness plan. Requirements:
1. Tone: like a wise friend who knows you well — warm, encouraging, non-judgmental
2. Include 3 specific, actionable steps the user can take today
3. End with the classical quote and explain its meaning in modern terms
4. Keep it 300-400 words
5. Be direct and specific, not generic

Format with markdown headers:
「🧘 Today's Note」— One sentence summary
「🌿 Nutrition」— What to eat and why
「🏃 Movement」— What to do and when
「📜 Ancient Wisdom」— Quote + modern interpretation`;
}

// 获取五行建议
function getSuggestion(wx) {
  return WUXING_SUGGESTIONS[wx] || WUXING_SUGGESTIONS['土'];
}

module.exports = { buildPrompt, buildPromptEn, getSuggestion, WUXING_SUGGESTIONS };
