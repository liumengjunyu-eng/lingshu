/**
 * 玄机阁 · 数据扩充包二：命理核心数据
 * 十神对照表、60甲子纳音、大运起运规则、紫微斗数14主星、神煞表
 */

// ============ 十神对照表 ============
// 以日干为我，看其他干的关系：同我=比肩/劫财，生我=正印/偏印，我生=食神/伤官，
// 克我=正官/七杀，我克=正财/偏财
// 阳见阳、阴见阴=偏（偏印=枭神、偏财、七杀、比肩）；阳见阴、阴见阳=正（正印、正财、正官、劫财）
const TEN_GODS = {};
(function() {
  const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const WX = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
  const YY = { '甲':'阳','乙':'阴','丙':'阳','丁':'阴','戊':'阳','己':'阴','庚':'阳','辛':'阴','壬':'阳','癸':'阴'};
  // 五行生克
  const SHENG = { '木':'火','火':'土','土':'金','金':'水','水':'木' }; // 我生
  const KE = { '木':'土','土':'水','水':'火','火':'金','金':'木' }; // 我克
  function shengMe(wx) { for (const k in SHENG) if (SHENG[k]===wx) return k; } // 生我
  function keMe(wx) { for (const k in KE) if (KE[k]===wx) return k; } // 克我

  STEMS.forEach(dayStem => {
    const myWx = WX[dayStem], myYy = YY[dayStem];
    TEN_GODS[dayStem] = {};
    STEMS.forEach(other => {
      const oWx = WX[other], oYy = YY[other];
      const sameYy = (myYy === oYy); // 同阴阳=偏
      let god;
      if (oWx === myWx) {
        god = sameYy ? '比肩' : '劫财';
      } else if (shengMe(myWx) === oWx) {
        god = sameYy ? '偏印' : '正印';
      } else if (SHENG[myWx] === oWx) {
        god = sameYy ? '食神' : '伤官';
      } else if (keMe(myWx) === oWx) {
        god = sameYy ? '七杀' : '正官';
      } else if (KE[myWx] === oWx) {
        god = sameYy ? '偏财' : '正财';
      }
      TEN_GODS[dayStem][other] = god;
    });
  });
})();

// ============ 60甲子纳音五行表 ============
const NAYIN = [
  '海中金','海中金','炉中火','炉中火','大林木','大林木','路旁土','路旁土','剑锋金','剑锋金', // 甲子~癸酉(0-9)
  '山头火','山头火','涧下水','涧下水','城墙土','城墙土','白蜡金','白蜡金','杨柳木','杨柳木', // 甲戌~癸未(10-19)
  '井泉水','井泉水','屋上土','屋上土','霹雳火','霹雳火','松柏木','松柏木','金箔金','金箔金', // 甲申~癸巳(20-29)
  '覆灯火','覆灯火','天河水','天河水','大驿土','大驿土','钗钏金','钗钏金','桑柘木','桑柘木', // 甲午~癸卯(30-39)
  '大溪水','大溪水','沙中土','沙中土','天上火','天上火','石榴木','石榴木','大海水','大海水'  // 甲辰~癸亥(40-49)
];
// 注：索引0=甲子，索引59=癸亥。每两个甲子对应一个纳音。
// 修正：标准纳音每两柱一组，共30组
const NAYIN_TABLE = {};
(function() {
  const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const nayinList = [
    '海中金','海中金','炉中火','炉中火','大林木','大林木','路旁土','路旁土','剑锋金','剑锋金',
    '山头火','山头火','涧下水','涧下水','城墙土','城墙土','白蜡金','白蜡金','杨柳木','杨柳木',
    '井泉水','井泉水','屋上土','屋上土','霹雳火','霹雳火','松柏木','松柏木','金箔金','金箔金',
    '覆灯火','覆灯火','天河水','天河水','大驿土','大驿土','钗钏金','钗钏金','桑柘木','桑柘木',
    '大溪水','大溪水','沙中土','沙中土','天上火','天上火','石榴木','石榴木','大海水','大海水'
  ];
  // 六十甲子
  for (let i = 0; i < 60; i++) {
    const stem = STEMS[i % 10];
    const branch = BRANCHES[i % 12];
    const key = stem + branch;
    NAYIN_TABLE[key] = nayinList[i];
  }
})();

// 从纳音名提取五行
function nayinWuxing(nayin) {
  if (nayin.includes('金')) return '金';
  if (nayin.includes('木')) return '木';
  if (nayin.includes('水')) return '水';
  if (nayin.includes('火')) return '火';
  if (nayin.includes('土')) return '土';
  return '';
}

// ============ 大运起运规则 ============
// 大运由月柱推排，阳男阴女顺排，阴男阳女逆排
// 起运岁数 = 出生日距下一个（顺排）或上一个（逆排）节气天数 ÷ 3
function calcDaYun(yearStem, gender, monthGanZhi, birthDate) {
  const YANG_STEMS = ['甲','丙','戊','庚','壬'];
  const isYangStem = YANG_STEMS.includes(yearStem);
  // 阳男阴女顺排，阴男阳女逆排
  const forward = (isYangStem && gender === '男') || (!isYangStem && gender === '女');

  // 计算月柱在六十甲子中的序号
  const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  // monthGanZhi 可以是 "壬午" 这样的字符串，也可以只传月支
  let monthIdx60 = -1;
  if (typeof monthGanZhi === 'string' && monthGanZhi.length >= 2) {
    const mg = monthGanZhi[0], mz = monthGanZhi[1];
    for (let i = 0; i < 60; i++) {
      if (STEMS[i % 10] === mg && BRANCHES[i % 12] === mz) { monthIdx60 = i; break; }
    }
  }
  // 如果只传了月支（旧接口兼容），用近似
  if (monthIdx60 < 0) {
    const mz = typeof monthGanZhi === 'string' ? monthGanZhi : '';
    const bIdx = BRANCHES.indexOf(mz);
    monthIdx60 = bIdx >= 0 ? bIdx : 0;
  }

  // 起运岁数（简化：用出生月日估算）
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();
  // 简化估算：距节气天数，约3天=1岁
  const daysToTerm = forward ? (30 - birthDay) : birthDay;
  const startAge = Math.max(1, Math.round(daysToTerm / 3));

  // 排8步大运（每步10年），从月柱六十甲子序号顺/逆推
  const dayuns = [];
  for (let i = 1; i <= 8; i++) {
    const offset = forward ? i : -i;
    const idx = ((monthIdx60 + offset) % 60 + 60) % 60;
    dayuns.push({
      gan: STEMS[idx % 10],
      zhi: BRANCHES[idx % 12],
      age: startAge + (i - 1) * 10,
      endAge: startAge + i * 10 - 1
    });
  }
  return { startAge, forward, dayuns };
}

// ============ 紫微斗数14主星 ============
const ZIWEI_STARS = [
  { name:'紫微', type:'主星', nature:'帝王星', traits:'尊贵、领导、威严、孤高', palace:'命宫主贵' },
  { name:'天机', type:'主星', nature:'智慧星', traits:'聪明、善思、多变、谋略', palace:'善筹划' },
  { name:'太阳', type:'主星', nature:'贵星', traits:'热情、光明、博爱、辛劳', palace:'主事业名声' },
  { name:'武曲', type:'主星', nature:'财星', traits:'刚毅、果断、重财、实干', palace:'主财运' },
  { name:'天同', type:'主星', nature:'福星', traits:'温和、乐观、享乐、慵懒', palace:'主福气' },
  { name:'廉贞', type:'主星', nature:'囚星', traits:'刚柔并济、争胜、感情丰富', palace:'主官禄' },
  { name:'天府', type:'主星', nature:'库星', traits:'稳重、保守、富足、藏蓄', palace:'主财库' },
  { name:'太阴', type:'主星', nature:'母星', traits:'温柔、细腻、恋家、阴柔', palace:'主田宅母缘' },
  { name:'贪狼', type:'主星', nature:'桃花星', traits:'多欲、多才、交际、变化', palace:'主桃花欲望' },
  { name:'巨门', type:'主星', nature:'暗星', traits:'口才、多疑、是非、钻研', palace:'主口舌' },
  { name:'天相', type:'主星', nature:'印星', traits:'正直、辅佐、保守、重外表', palace:'主官禄' },
  { name:'天梁', type:'主星', nature:'荫星', traits:'清高、正直、老人星、逢凶化吉', palace:'主寿元' },
  { name:'七杀', type:'主星', nature:'将星', traits:'勇猛、刚强、独立、冒险', palace:'主开创' },
  { name:'破军', type:'主星', nature:'耗星', traits:'破坏、创新、冲动、变荡', palace:'主变革' }
];

// 紫微十二宫
const ZIWEI_PALACES = [
  '命宫','兄弟','夫妻','子女','财帛','疾厄',
  '迁移','交友','官禄','田宅','福德','父母'
];

// ============ 常用神煞表 ============
const SHENSHA = {
  tianyi: { // 天乙贵人（文昌贵人）
    '甲':'丑未','乙':'子申','丙':'酉亥','丁':'酉亥','戊':'丑未',
    '己':'子申','庚':'丑未','辛':'午寅','壬':'卯巳','癸':'卯巳'
  },
  wenchang: { // 文昌星
    '甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申',
    '己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'
  },
  taohua: { // 桃花（日支查）
    '子':'卯','卯':'子','午':'酉','酉':'午', // 申子辰→酉(改:巳酉丑→午)
    '寅':'卯','辰':'酉','巳':'午','未':'卯','申':'酉','戌':'卯','亥':'午'
    // 标准桃花：申子辰→酉，亥卯未→子，寅午戌→卯，巳酉丑→午
  }
};
// 修正桃花：按三合局
const TAOhUA_MAP = {
  // 申子辰→酉
  '申':'酉','子':'酉','辰':'酉',
  // 亥卯未→子
  '亥':'子','卯':'子','未':'子',
  // 寅午戌→卯
  '寅':'卯','午':'卯','戌':'卯',
  // 巳酉丑→午
  '巳':'午','酉':'午','丑':'午'
};

// ============ 十神含义解读 ============
const TEN_GODS_MEANING = {
  '比肩': '自立、竞争、朋友、同辈，主个性独立',
  '劫财': '争夺、冲动、破财、合作，主好胜固执',
  '食神': '才华、口福、享受、温和，主有福有才',
  '伤官': '聪明、叛逆、口才、创新，主才华外露',
  '偏财': '横财、慷慨、交际、父亲，主财来财去',
  '正财': '勤俭、稳定、收入、妻子，主财源稳定',
  '七杀': '权威、压力、魄力、小人，主有魄力有压力',
  '正官': '正统、守法、名誉、丈夫，主循规蹈矩',
  '偏印': '孤独、偏门、灵感、继母，主思维独特',
  '正印': '学业、慈爱、保护、母亲，主有贵人庇护'
};

// 导出
Object.assign(window.XJG_DATA, {
  TEN_GODS, NAYIN_TABLE, ZIWEI_STARS, ZIWEI_PALACES,
  SHENSHA, TAOhUA_MAP, TEN_GODS_MEANING
});
window.XJG_ENGINE_NAYIN_WX = nayinWuxing;
window.XJG_ENGINE_CALCDAYUN = calcDaYun;
