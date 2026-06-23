/**
 * 玄机阁 · 数据扩充包五：体质自测问卷 + 本草药材 + 针灸穴位
 */

// ============ 一、中医九体质自测问卷 ============
// 基于王琦《中医体质分类与判定》ZYYXH/T157-2009标准
// 每题5级评分：1没有 2很少 3有时 4经常 5总是
const CONSTITUTION_QUIZ = {
  scale: [
    { val: 1, label: '没有（根本不）' },
    { val: 2, label: '很少（有一点）' },
    { val: 3, label: '有时（有些）' },
    { val: 4, label: '经常（相当多）' },
    { val: 5, label: '总是（非常明显）' }
  ],
  // 各体质转化分阈值：>=60判定为"是"，40~59为"倾向是"
  threshold: { yes: 60, tend: 40 },
  questions: [
    // 平和质（反向计分题，得分越低越倾向平和）
    { id: 1, text: '您精力充沛吗？', type: '平和', reverse: false },
    { id: 2, text: '您容易疲乏吗？', type: '平和', reverse: true },
    { id: 3, text: '您说话声音低弱无力吗？', type: '平和', reverse: true },
    { id: 4, text: '您感到闷闷不乐、情绪低沉吗？', type: '平和', reverse: true },
    { id: 5, text: '您比一般人耐受不了寒冷（冬天的寒冷、夏天的冷空调、电扇等）吗？', type: '平和', reverse: true },
    { id: 6, text: '您能适应外界自然和社会环境的变化吗？', type: '平和', reverse: false },
    { id: 7, text: '您容易失眠吗？', type: '平和', reverse: true },
    { id: 8, text: '您容易忘事（健忘）吗？', type: '平和', reverse: true },

    // 气虚质
    { id: 9, text: '您容易疲乏吗？', type: '气虚' },
    { id: 10, text: '您容易气短，呼吸短促，接不上气吗？', type: '气虚' },
    { id: 11, text: '您容易心慌吗？', type: '气虚' },
    { id: 12, text: '您容易头晕或站起时晕眩吗？', type: '气虚' },
    { id: 13, text: '您比别人容易患感冒吗？', type: '气虚' },
    { id: 14, text: '您喜欢安静、懒得说话吗？', type: '气虚' },
    { id: 15, text: '您说话声音低弱无力吗？', type: '气虚' },
    { id: 16, text: '您活动量稍大就容易出虚汗吗？', type: '气虚' },

    // 阳虚质
    { id: 17, text: '您手脚发凉吗？', type: '阳虚' },
    { id: 18, text: '您胃脘部、背部或腰膝部怕冷吗？', type: '阳虚' },
    { id: 19, text: '您感到怕冷、衣服比别人穿得多吗？', type: '阳虚' },
    { id: 20, text: '您比一般人耐受不了寒冷吗？', type: '阳虚' },
    { id: 21, text: '您比别人容易患感冒吗？', type: '阳虚' },
    { id: 22, text: '您吃（喝）凉的东西会感到不舒服或者怕吃（喝）凉东西吗？', type: '阳虚' },
    { id: 23, text: '您受凉或吃（喝）凉的东西后，容易腹泻（拉肚子）吗？', type: '阳虚' },

    // 阴虚质
    { id: 24, text: '您感到手脚心发热吗？', type: '阴虚' },
    { id: 25, text: '您感觉身体、脸上发热吗？', type: '阴虚' },
    { id: 26, text: '您皮肤或口唇干吗？', type: '阴虚' },
    { id: 27, text: '您口唇的颜色比一般人红吗？', type: '阴虚' },
    { id: 28, text: '您容易便秘或大便干燥吗？', type: '阴虚' },
    { id: 29, text: '您面部两颧潮红或偏红吗？', type: '阴虚' },
    { id: 30, text: '您感到眼睛干涩吗？', type: '阴虚' },
    { id: 31, text: '您感到口干咽燥，总想喝水吗？', type: '阴虚' },

    // 痰湿质
    { id: 32, text: '您感到胸闷或腹部胀满吗？', type: '痰湿' },
    { id: 33, text: '您感到身体沉重不轻松或不爽快吗？', type: '痰湿' },
    { id: 34, text: '您腹部肥满松软吗？', type: '痰湿' },
    { id: 35, text: '您有额部油脂分泌多的现象吗？', type: '痰湿' },
    { id: 36, text: '您上眼睑比别人肿（轻微隆起）吗？', type: '痰湿' },
    { id: 37, text: '您嘴里有黏黏的感觉吗？', type: '痰湿' },
    { id: 38, text: '您平时痰多，特别是咽喉部总感到有痰堵着吗？', type: '痰湿' },
    { id: 39, text: '您舌苔厚腻或有舌苔厚厚的感觉吗？', type: '痰湿' },

    // 湿热质
    { id: 40, text: '您面部或鼻部有油腻感或者油亮发光吗？', type: '湿热' },
    { id: 41, text: '您易生痤疮或疮疖吗？', type: '湿热' },
    { id: 42, text: '您感到口苦或嘴里有异味吗？', type: '湿热' },
    { id: 43, text: '您大便黏滞不爽、有解不尽的感觉吗？', type: '湿热' },
    { id: 44, text: '您小便时尿道有发热感、尿色浓（深）吗？', type: '湿热' },
    { id: 45, text: '您带下色黄（白带颜色发黄）（限女性回答）或阴囊部位潮湿（限男性回答）吗？', type: '湿热' },

    // 血瘀质
    { id: 46, text: '您的皮肤在不知不觉中会出现青紫瘀斑（皮下出血）吗？', type: '血瘀' },
    { id: 47, text: '您两颧部有细微红丝吗？', type: '血瘀' },
    { id: 48, text: '您身体上有哪里疼痛吗？', type: '血瘀' },
    { id: 49, text: '您面色晦黯或容易出现褐斑吗？', type: '血瘀' },
    { id: 50, text: '您容易有黑眼圈吗？', type: '血瘀' },
    { id: 51, text: '您容易忘事（健忘）吗？', type: '血瘀' },
    { id: 52, text: '您口唇颜色偏黯吗？', type: '血瘀' },

    // 气郁质
    { id: 53, text: '您感到闷闷不乐、情绪低沉吗？', type: '气郁' },
    { id: 54, text: '您容易精神紧张、焦虑不安吗？', type: '气郁' },
    { id: 55, text: '您多愁善感、感情脆弱吗？', type: '气郁' },
    { id: 56, text: '您容易感到害怕或受惊吓吗？', type: '气郁' },
    { id: 57, text: '您胁肋部或乳房胀痛吗？', type: '气郁' },
    { id: 58, text: '您无缘无故叹气吗？', type: '气郁' },
    { id: 59, text: '您咽喉部有异物感、且吐之不出咽之不下吗？', type: '气郁' },

    // 特禀质
    { id: 60, text: '您没有感冒时也会打喷嚏吗？', type: '特禀' },
    { id: 61, text: '您没有感冒时也会鼻塞、流鼻涕吗？', type: '特禀' },
    { id: 62, text: '您有因过敏体质导致的问题（如药物过敏、食物过敏、花粉过敏、季节性过敏等）吗？', type: '特禀' },
    { id: 63, text: '您的皮肤容易起荨麻疹（风团、风疹块、风疙瘩）吗？', type: '特禀' },
    { id: 64, text: '您的皮肤因过敏出现过紫癜（紫红色瘀点、瘀斑）吗？', type: '特禀' },
    { id: 65, text: '您的皮肤一抓就红，并出现抓痕吗？', type: '特禀' }
  ]
};

// 体质判定算法
function calcConstitution(answers) {
  // answers: { questionId: score(1-5) }
  const typeScores = { '平和':0, '气虚':0, '阴虚':0, '阳虚':0, '痰湿':0, '湿热':0, '血瘀':0, '气郁':0, '特禀':0 };
  const typeCounts = { '平和':0, '气虚':0, '阴虚':0, '阳虚':0, '痰湿':0, '湿热':0, '血瘀':0, '气郁':0, '特禀':0 };

  CONSTITUTION_QUIZ.questions.forEach(q => {
    const score = answers[q.id] || 3;
    if (q.type === '平和') {
      // 平和质：正向题正向计分，反向题反向计分（6-score）
      typeScores['平和'] += q.reverse ? (6 - score) : score;
      typeCounts['平和']++;
    } else {
      typeScores[q.type] += score;
      typeCounts[q.type]++;
    }
  });

  // 计算转化分（0~100）
  const convertedScores = {};
  for (const type in typeScores) {
    const rawSum = typeScores[type];
    const count = typeCounts[type];
    // 转化分 = (原始分 - 条目数) / (条目数 × 4) × 100
    convertedScores[type] = Math.round((rawSum - count) / (count * 4) * 100);
  }

  // 判定逻辑：偏颇体质≥60为"是"，平和质≥60且其他<40为"是"
  const results = [];
  for (const type of ['气虚','阴虚','阳虚','痰湿','湿热','血瘀','气郁','特禀']) {
    const score = convertedScores[type];
    if (score >= 60) results.push({ type, score, level: '是' });
    else if (score >= 40) results.push({ type, score, level: '倾向是' });
  }

  // 平和质判定
  const pingheScore = convertedScores['平和'];
  const hasPianpo = results.some(r => r.level === '是');
  if (pingheScore >= 60 && !hasPianpo) {
    results.unshift({ type: '平和', score: pingheScore, level: '是' });
  } else if (pingheScore >= 60) {
    results.unshift({ type: '平和', score: pingheScore, level: '基本是' });
  }

  // 排序：按转化分降序
  results.sort((a, b) => b.score - a.score);

  // 主体质 = 分数最高的
  const primary = results[0] || { type: '平和', score: pingheScore, level: '是' };

  return { primary, results, allScores: convertedScores };
}

// ============ 二、本草纲目核心药材条目 ============
const HERBS = [
  { id:'h001', name:'艾叶', pinyin:'Ai Ye', source:'《本草纲目》草部', nature:'温', flavor:'苦、辛', meridian:'肝、脾、肾经', efficacy:'温经止血、散寒止痛、安胎', usage:'艾灸、煎服3-10g、外洗', taboo:'阴虚血热者慎用', food:'是', note:'李时珍曰：艾叶……以蕲州者为胜。蕲艾挥发油含量高，灸感渗透强。' },
  { id:'h002', name:'黄芪', pinyin:'Huang Qi', source:'《本草纲目》草部', nature:'微温', flavor:'甘', meridian:'脾、肺经', efficacy:'补气固表、利水消肿、托毒生肌', usage:'煎服9-30g、入膳炖汤', taboo:'实证、阴虚阳亢者不宜', food:'是', note:'补气之长，药食两用。气虚体质首选。' },
  { id:'h003', name:'人参', pinyin:'Ren Shen', source:'《本草纲目》草部', nature:'温', flavor:'甘、微苦', meridian:'脾、肺、心经', efficacy:'大补元气、复脉固脱、补脾益肺', usage:'煎服3-9g、另煎兑服', taboo:'实证、热证、反藜芦', food:'否', note:'百草之王，大补元气。' },
  { id:'h004', name:'党参', pinyin:'Dang Shen', source:'《本草纲目》草部', nature:'平', flavor:'甘', meridian:'脾、肺经', efficacy:'补中益气、健脾益肺', usage:'煎服9-30g、入膳', taboo:'实证、热证者不宜', food:'是', note:'功效似人参而力缓，药食两用佳品。' },
  { id:'h005', name:'当归', pinyin:'Dang Gui', source:'《本草纲目》草部', nature:'温', flavor:'甘、辛', meridian:'肝、心、脾经', efficacy:'补血活血、调经止痛、润肠通便', usage:'煎服6-12g、入膳', taboo:'湿盛中满、大便溏泄者不宜', food:'是', note:'妇科圣药，补血第一。' },
  { id:'h006', name:'枸杞子', pinyin:'Gou Qi Zi', source:'《本草纲目》木部', nature:'平', flavor:'甘', meridian:'肝、肾经', efficacy:'滋补肝肾、益精明目', usage:'煎服6-12g、泡茶、入膳', taboo:'脾虚便溏者不宜', food:'是', note:'药食两用，滋阴明目佳品。' },
  { id:'h007', name:'山药', pinyin:'Shan Yao', source:'《本草纲目》菜部', nature:'平', flavor:'甘', meridian:'脾、肺、肾经', efficacy:'补脾养胃、生津益肺、补肾涩精', usage:'煎食15-30g、入膳', taboo:'湿盛中满者不宜', food:'是', note:'药食同源经典，健脾益肾。' },
  { id:'h008', name:'茯苓', pinyin:'Fu Ling', source:'《本草纲目》木部', nature:'平', flavor:'甘、淡', meridian:'心、脾、肾经', efficacy:'利水渗湿、健脾宁心', usage:'煎服10-15g、入膳', taboo:'阴虚而无湿热者不宜', food:'是', note:'四君子汤主药，健脾利湿。' },
  { id:'h009', name:'百合', pinyin:'Bai He', source:'《本草纲目》菜部', nature:'微寒', flavor:'甘', meridian:'心、肺经', efficacy:'养阴润肺、清心安神', usage:'煎服6-12g、入膳', taboo:'风寒咳嗽者不宜', food:'是', note:'药食两用，润肺安神。' },
  { id:'h010', name:'薏苡仁', pinyin:'Yi Yi Ren', source:'《本草纲目》谷部', nature:'凉', flavor:'甘、淡', meridian:'脾、胃、肺经', efficacy:'健脾渗湿、除痹止泻、清热排脓', usage:'煎食9-30g、入膳', taboo:'孕妇慎用', food:'是', note:'药食两用，祛湿佳品。' },
  { id:'h011', name:'红枣', pinyin:'Hong Zao', source:'《本草纲目》果部', nature:'温', flavor:'甘', meridian:'脾、胃经', efficacy:'补中益气、养血安神', usage:'劈破煎服6-15g、入膳', taboo:'脘腹胀满、痰湿盛者不宜', food:'是', note:'药食同源，补气养血。' },
  { id:'h012', name:'桂圆（龙眼肉）', pinyin:'Gui Yuan', source:'《本草纲目》果部', nature:'温', flavor:'甘', meridian:'心、脾经', efficacy:'补益心脾、养血安神', usage:'煎服9-15g、入膳', taboo:'痰火内盛、湿滞中满者不宜', food:'是', note:'药食两用，养心安神。' },
  { id:'h013', name:'陈皮', pinyin:'Chen Pi', source:'《本草纲目》果部', nature:'温', flavor:'辛、苦', meridian:'脾、肺经', efficacy:'理气健脾、燥湿化痰', usage:'煎服3-10g、泡茶', taboo:'气虚证、阴虚燥咳者不宜', food:'是', note:'药食两用，理气化痰。' },
  { id:'h014', name:'生姜', pinyin:'Sheng Jiang', source:'《本草纲目》菜部', nature:'微温', flavor:'辛', meridian:'肺、脾、胃经', efficacy:'解表散寒、温中止呕、温肺止咳', usage:'煎服3-10g、入膳', taboo:'阴虚内热者不宜', food:'是', note:'药食同源，温中散寒。' },
  { id:'h015', name:'玫瑰花', pinyin:'Mei Gui Hua', source:'《本草纲目》草部', nature:'温', flavor:'甘、微苦', meridian:'肝、脾经', efficacy:'疏肝理气、活血止痛', usage:'泡茶3-6g', taboo:'孕妇、月经量多者不宜', food:'是', note:'药食两用，疏肝解郁。' },
  { id:'h016', name:'山楂', pinyin:'Shan Zha', source:'《本草纲目》果部', nature:'微温', flavor:'酸、甘', meridian:'脾、胃、肝经', efficacy:'消食化积、行气散瘀', usage:'煎服9-12g、泡茶', taboo:'脾胃虚弱者不宜', food:'是', note:'药食两用，消食活血。' },
  { id:'h017', name:'莲子', pinyin:'Lian Zi', source:'《本草纲目》果部', nature:'平', flavor:'甘、涩', meridian:'脾、肾、心经', efficacy:'补脾止泻、止带、养心安神', usage:'煎食6-15g、入膳', taboo:'中满痞胀、大便燥结者不宜', food:'是', note:'药食同源，健脾安神。' },
  { id:'h018', name:'菊花', pinyin:'Ju Hua', source:'《本草纲目》草部', nature:'微寒', flavor:'辛、甘、苦', meridian:'肝、肺经', efficacy:'疏风清热、平肝明目、清热解毒', usage:'泡茶5-10g', taboo:'气虚胃寒者不宜', food:'是', note:'药食两用，清肝明目。' },
  { id:'h019', name:'薄荷', pinyin:'Bo He', source:'《本草纲目》草部', nature:'凉', flavor:'辛', meridian:'肝、肺经', efficacy:'疏散风热、清利头目、疏肝行气', usage:'泡茶3-6g（后下）', taboo:'体虚多汗者不宜', food:'是', note:'药食两用，疏肝清热。' },
  { id:'h020', name:'肉桂', pinyin:'Rou Gui', source:'《本草纲目》木部', nature:'大热', flavor:'辛、甘', meridian:'肾、脾、心、肝经', efficacy:'补火助阳、散寒止痛、温通经脉', usage:'煎服1-5g、入膳', taboo:'阴虚火旺、孕妇忌用', food:'是', note:'药食两用，温阳散寒。' },
  { id:'h021', name:'核桃仁', pinyin:'He Tao Ren', source:'《本草纲目》果部', nature:'温', flavor:'甘', meridian:'肾、肺、大肠经', efficacy:'补肾温肺、润肠通便', usage:'入膳9-30g', taboo:'阴虚火旺者不宜', food:'是', note:'药食同源，补肾润肠。' },
  { id:'h022', name:'黑芝麻', pinyin:'Hei Zhi Ma', source:'《本草纲目》谷部', nature:'平', flavor:'甘', meridian:'肝、肾、大肠经', efficacy:'补肝肾、益精血、润肠燥', usage:'入膳9-15g', taboo:'脾虚便溏者不宜', food:'是', note:'药食同源，乌发养肾。' },
  { id:'h023', name:'桑葚', pinyin:'Sang Shen', source:'《本草纲目》果部', nature:'寒', flavor:'甘、酸', meridian:'心、肝、肾经', efficacy:'滋阴补血、生津润燥', usage:'入膳9-15g、泡茶', taboo:'脾胃虚寒便溏者不宜', food:'是', note:'药食两用，滋阴养血。' },
  { id:'h024', name:'玉竹', pinyin:'Yu Zhu', source:'《本草纲目》草部', nature:'微寒', flavor:'甘', meridian:'肺、胃经', efficacy:'养阴润燥、生津止渴', usage:'煎服6-12g、入膳', taboo:'痰湿气滞者不宜', food:'是', note:'药食两用，养阴润肺。' },
  { id:'h025', name:'银耳', pinyin:'Yin Er', source:'《本草纲目》菜部', nature:'平', flavor:'甘', meridian:'肺、胃、肾经', efficacy:'滋阴润肺、养胃生津', usage:'入膳3-10g', taboo:'风寒咳嗽者不宜', food:'是', note:'药食同源，平民燕窝。' },
  { id:'h026', name:'赤小豆', pinyin:'Chi Xiao Dou', source:'《本草纲目》谷部', nature:'平', flavor:'甘、酸', meridian:'心、小肠经', efficacy:'利水消肿、解毒排脓', usage:'入膳9-30g', taboo:'尿多者不宜', food:'是', note:'药食同源，利湿消肿。' },
  { id:'h027', name:'佛手', pinyin:'Fo Shou', source:'《本草纲目》果部', nature:'温', flavor:'辛、苦、酸', meridian:'肝、脾、肺经', efficacy:'疏肝理气、和胃止痛、燥湿化痰', usage:'泡茶3-10g', taboo:'阴虚火旺者不宜', food:'是', note:'药食两用，疏肝理气。' },
  { id:'h028', name:'防风', pinyin:'Fang Feng', source:'《本草纲目》草部', nature:'微温', flavor:'辛、甘', meridian:'膀胱、肝、脾经', efficacy:'祛风解表、胜湿止痛、止痉', usage:'煎服5-10g', taboo:'阴虚火旺者不宜', food:'否', note:'玉屏风散主药，固表防风。' },
  { id:'h029', name:'白术', pinyin:'Bai Zhu', source:'《本草纲目》草部', nature:'温', flavor:'苦、甘', meridian:'脾、胃经', efficacy:'健脾益气、燥湿利水、止汗、安胎', usage:'煎服6-12g', taboo:'阴虚燥渴者不宜', food:'否', note:'四君子汤主药，健脾燥湿。' },
  { id:'h030', name:'甘草', pinyin:'Gan Cao', source:'《本草纲目》草部', nature:'平', flavor:'甘', meridian:'心、肺、脾、胃经', efficacy:'补脾益气、清热解毒、祛痰止咳、调和诸药', usage:'煎服3-10g', taboo:'不宜与甘遂、大戟、芫花同用', food:'否', note:'国老，调和诸药。' }
];

// ============ 三、针灸常用穴位 ============
const ACUPOINTS = [
  { id:'a001', name:'足三里', location:'犊鼻穴下3寸，胫骨前嵴外开1横指', meridian:'足阳明胃经', efficacy:'健脾和胃、扶正培元、强身保健', usage:'保健灸要穴，每日灸15-20分钟', category:'保健' },
  { id:'a002', name:'关元', location:'前正中线上，脐下3寸', meridian:'任脉', efficacy:'培元固本、温阳补虚', usage:'温补要穴，隔姜灸或温和灸', category:'温补' },
  { id:'a003', name:'气海', location:'前正中线上，脐下1.5寸', meridian:'任脉', efficacy:'益气助阳、调经固精', usage:'气虚要穴，温和灸', category:'补气' },
  { id:'a004', name:'神阙', location:'肚脐正中', meridian:'任脉', efficacy:'温阳救逆、健脾和胃', usage:'隔盐灸或隔姜灸，冬至灸要穴', category:'温补' },
  { id:'a005', name:'命门', location:'后正中线上，第二腰椎棘突下', meridian:'督脉', efficacy:'温肾壮阳、培元固本', usage:'温阳要穴，温和灸或隔姜灸', category:'温补' },
  { id:'a006', name:'肾俞', location:'第二腰椎棘突下，旁开1.5寸', meridian:'足太阳膀胱经', efficacy:'补肾强腰、温阳利水', usage:'补肾要穴，温和灸', category:'补肾' },
  { id:'a007', name:'太溪', location:'内踝后方，内踝尖与跟腱之间凹陷处', meridian:'足少阴肾经', efficacy:'滋阴补肾、清虚热', usage:'滋阴要穴，轻灸', category:'滋阴' },
  { id:'a008', name:'三阴交', location:'内踝尖上3寸，胫骨内侧后缘', meridian:'足太阴脾经', efficacy:'健脾利湿、调经固精、滋阴养血', usage:'妇科要穴，温和灸', category:'调经' },
  { id:'a009', name:'太冲', location:'足背第一二跖骨结合部前方凹陷处', meridian:'足厥阴肝经', efficacy:'疏肝理气、平肝潜阳', usage:'疏肝要穴，温和灸', category:'疏肝' },
  { id:'a010', name:'丰隆', location:'外踝尖上8寸，胫骨前嵴外2横指', meridian:'足阳明胃经', efficacy:'健脾化痰、和胃降逆', usage:'化痰要穴，温和灸', category:'化痰' },
  { id:'a011', name:'中脘', location:'前正中线上，脐上4寸', meridian:'任脉', efficacy:'健脾和胃、降逆利水', usage:'胃病要穴，温和灸', category:'健脾' },
  { id:'a012', name:'阴陵泉', location:'胫骨内侧髁后下方凹陷处', meridian:'足太阴脾经', efficacy:'健脾利湿、通利小便', usage:'祛湿要穴，温和灸', category:'祛湿' },
  { id:'a013', name:'血海', location:'髌骨内上缘上2寸', meridian:'足太阴脾经', efficacy:'活血化瘀、调经统血', usage:'活血要穴，温和灸', category:'活血' },
  { id:'a014', name:'膈俞', location:'第七胸椎棘突下，旁开1.5寸', meridian:'足太阳膀胱经', efficacy:'活血化瘀、宽胸理气', usage:'血会膈俞，温和灸', category:'活血' },
  { id:'a015', name:'膻中', location:'前正中线上，平第四肋间隙', meridian:'任脉', efficacy:'宽胸理气、活血通络', usage:'气会膻中，温和灸', category:'理气' },
  { id:'a016', name:'期门', location:'乳头直下，第六肋间隙', meridian:'足厥阴肝经', efficacy:'疏肝健脾、活血化瘀', usage:'疏肝要穴，温和灸', category:'疏肝' },
  { id:'a017', name:'大椎', location:'第七颈椎棘突下', meridian:'督脉', efficacy:'清热解表、截疟止痫', usage:'温灸大椎可提升阳气', category:'清热' },
  { id:'a018', name:'肺俞', location:'第三胸椎棘突下，旁开1.5寸', meridian:'足太阳膀胱经', efficacy:'宣肺解表、养阴润肺', usage:'肺病要穴，温和灸', category:'润肺' },
  { id:'a019', name:'尺泽', location:'肘横纹中，肱二头肌腱桡侧凹陷处', meridian:'手太阴肺经', efficacy:'清肺泄热、和胃降逆', usage:'肺经要穴，温和灸', category:'润肺' },
  { id:'a020', name:'迎香', location:'鼻翼旁开0.5寸，鼻唇沟中', meridian:'手阳明大肠经', efficacy:'祛风通鼻、散寒清热', usage:'鼻窍要穴，温和灸', category:'五官' },
  { id:'a021', name:'睛明', location:'目内眦旁0.1寸', meridian:'足太阳膀胱经', efficacy:'疏风清热、明目', usage:'眼部要穴，不宜直接灸', category:'五官' },
  { id:'a022', name:'太阳', location:'眉梢与目外眦之间向后约1寸凹陷处', meridian:'经外奇穴', efficacy:'疏风清热、明目止痛', usage:'头痛眼疲劳要穴，温和灸', category:'五官' },
  { id:'a023', name:'耳门', location:'耳屏上切迹前方，下颌骨髁状突后缘', meridian:'手少阳三焦经', efficacy:'开窍聪耳、泄热活络', usage:'耳部要穴，温和灸', category:'五官' },
  { id:'a024', name:'听宫', location:'耳屏前，下颌骨髁状突后缘', meridian:'手太阳小肠经', efficacy:'聪耳开窍', usage:'耳部要穴，温和灸', category:'五官' },
  { id:'a025', name:'翳风', location:'耳垂后下方凹陷处', meridian:'手少阳三焦经', efficacy:'聪耳通窍、散风泄热', usage:'耳部要穴，温和灸', category:'五官' },
  { id:'a026', name:'廉泉', location:'前正中线上，喉结上方舌骨上缘凹陷处', meridian:'任脉', efficacy:'利喉舒舌、消肿止痛', usage:'喉部要穴，温和灸', category:'五官' },
  { id:'a027', name:'天突', location:'前正中线上，胸骨上窝中央', meridian:'任脉', efficacy:'宣通肺气、消痰止咳', usage:'喉部要穴，温和灸', category:'五官' },
  { id:'a028', name:'地仓', location:'口角旁开0.4寸', meridian:'足阳明胃经', efficacy:'祛风止痛、舒筋活络', usage:'口面部要穴，温和灸', category:'五官' },
  { id:'a029', name:'颊车', location:'下颌角前上方约1横指，咀嚼时咬肌隆起处', meridian:'足阳明胃经', efficacy:'祛风清热、开关通络', usage:'口面部要穴，温和灸', category:'五官' },
  { id:'a030', name:'百会', location:'后发际正中直上7寸，两耳尖连线中点', meridian:'督脉', efficacy:'醒脑开窍、安神定志、升阳举陷', usage:'安神要穴，温和灸', category:'安神' },
  { id:'a031', name:'神门', location:'腕横纹尺侧端，尺侧腕屈肌腱桡侧凹陷处', meridian:'手少阴心经', efficacy:'宁心安神、清心调志', usage:'安神要穴，温和灸', category:'安神' },
  { id:'a032', name:'内关', location:'腕横纹上2寸，掌长肌腱与桡侧腕屈肌腱之间', meridian:'手厥阴心包经', efficacy:'宁心安神、和胃降逆、宽胸理气', usage:'心脏要穴，温和灸', category:'安神' },
  { id:'a033', name:'列缺', location:'桡骨茎突上方，腕横纹上1.5寸', meridian:'手太阴肺经', efficacy:'宣肺利气、通经活络', usage:'喉部要穴，温和灸', category:'润肺' },
  { id:'a034', name:'太渊', location:'腕掌侧横纹桡侧，桡动脉搏动处', meridian:'手太阴肺经', efficacy:'宣肺平喘、通血脉', usage:'肺经要穴，温和灸', category:'润肺' },
  { id:'a035', name:'肝俞', location:'第九胸椎棘突下，旁开1.5寸', meridian:'足太阳膀胱经', efficacy:'疏肝利胆、养血明目', usage:'疏肝要穴，温和灸', category:'疏肝' },
  { id:'a036', name:'心俞', location:'第五胸椎棘突下，旁开1.5寸', meridian:'足太阳膀胱经', efficacy:'宁心安神、宽胸理气', usage:'心脏要穴，温和灸', category:'安神' },
  { id:'a037', name:'脾俞', location:'第十一胸椎棘突下，旁开1.5寸', meridian:'足太阳膀胱经', efficacy:'健脾和胃、利湿升清', usage:'健脾要穴，温和灸', category:'健脾' },
  { id:'a038', name:'阳陵泉', location:'腓骨小头前下方凹陷处', meridian:'足少阳胆经', efficacy:'疏肝利胆、舒筋活络', usage:'胆经要穴，温和灸', category:'疏肝' },
  { id:'a039', name:'复溜', location:'太溪穴上2寸，跟腱前缘', meridian:'足少阴肾经', efficacy:'滋阴补肾、利水消肿', usage:'滋阴要穴，轻灸', category:'滋阴' },
  { id:'a040', name:'涌泉', location:'足底前1/3与后2/3交界凹陷处', meridian:'足少阴肾经', efficacy:'滋阴降火、宁心安神', usage:'引火归元，温水泡后灸', category:'补肾' }
];

// 导出
Object.assign(window.XJG_DATA, {
  CONSTITUTION_QUIZ, HERBS, ACUPOINTS
});
window.XJG_ENGINE_CALC_CONSTITUTION = calcConstitution;
