/**
 * 玄机阁 · 分析引擎
 * 实现八字排盘、五行分析、星座判定、生物钟、体质匹配、艾灸/药食/穿戴/风水方案生成
 */

(function () {
  const D = window.XJG_DATA;

  // ============ 一、干支推算核心算法 ============

  /**
   * 公历日期 → 四柱八字
   * 使用Julian Day Number法推算日柱，确保准确性
   */
  function calcBaZi(year, month, day, hour, gender) {
    // 年柱：以立春(2/4)为分界
    const yearStemBranch = getYearStemBranch(year, month, day);

    // 月柱：根据节气确定月支
    const monthBranch = getMonthBranch(month, day);
    const monthStem = getMonthStem(yearStemBranch.stem, monthBranch);

    // 日柱：以已知日期为基准推算（2024-01-01 = 癸亥日，索引59）
    const dayStemBranch = getDayStemBranch(year, month, day);

    // 时柱：根据日干和时辰
    const hourBranch = getHourBranch(hour);
    const hourStem = getHourStem(dayStemBranch.stem, hourBranch);

    return {
      year: yearStemBranch.stem + yearStemBranch.branch,
      month: monthStem + monthBranch,
      day: dayStemBranch.stem + dayStemBranch.branch,
      hour: hourStem + hourBranch,
      gender: gender,
      dayMaster: dayStemBranch.stem, // 日主
      dayMasterWuxing: D.WUXING_OF_STEM[dayStemBranch.stem],
      zodiac: D.ZODIAC_OF_BRANCH[yearStemBranch.branch],
      yearBranch: yearStemBranch.branch,
      hourBranch: hourBranch
    };
  }

  // 年柱干支（以公元4年=甲子年为基准，立春2/4为分界）
  function getYearStemBranch(year, month, day) {
    const md = month * 100 + day;
    const actualYear = md < 204 ? year - 1 : year; // 立春前算上一年
    const offset = actualYear - 4; // 公元4年 = 甲子年
    const stemIdx = ((offset % 10) + 10) % 10;
    const branchIdx = ((offset % 12) + 12) % 12;
    return { stem: D.HEAVENLY_STEMS[stemIdx], branch: D.EARTHLY_BRANCHES[branchIdx] };
  }

  // 月支（按节气划分，精确到日）
  function getMonthBranch(month, day) {
    const md = month * 100 + day;
    if (md >= 204 && md < 305) return '寅';   // 立春~惊蛰
    if (md >= 305 && md < 405) return '卯';   // 惊蛰~清明
    if (md >= 405 && md < 506) return '辰';   // 清明~立夏
    if (md >= 506 && md < 606) return '巳';   // 立夏~芒种
    if (md >= 606 && md < 707) return '午';   // 芒种~小暑
    if (md >= 707 && md < 808) return '未';   // 小暑~立秋
    if (md >= 808 && md < 908) return '申';   // 立秋~白露
    if (md >= 908 && md < 1008) return '酉';  // 白露~寒露
    if (md >= 1008 && md < 1107) return '戌'; // 寒露~立冬
    if (md >= 1107 && md < 1207) return '亥'; // 立冬~大雪
    if (md >= 1207 || md < 105) return '子';  // 大雪~小寒
    return '丑'; // 小寒~立春
  }

  // 月干（五虎遁：年干推月干）
  function getMonthStem(yearStem, monthBranch) {
    const branchIdx = D.EARTHLY_BRANCHES.indexOf(monthBranch);
    // 寅月为正月，寅=索引2
    // 五虎遁口诀：甲己之年丙作首，乙庚之岁戊为头，丙辛之年庚开始，丁壬壬寅顺水流，戊癸甲寅好追求
    const stemStartMap = { '甲':'丙','己':'丙','乙':'戊','庚':'戊','丙':'庚','辛':'庚','丁':'壬','壬':'壬','戊':'甲','癸':'甲' };
    const startStem = stemStartMap[yearStem];
    const startIdx = D.HEAVENLY_STEMS.indexOf(startStem);
    const offset = (branchIdx - 2 + 12) % 12;
    return D.HEAVENLY_STEMS[(startIdx + offset) % 10];
  }

  // 日柱干支（基准日推算法：2024-01-01 = 甲子日，索引0）
  function getDayStemBranch(year, month, day) {
    const baseDate = new Date(2024, 0, 1); // 2024-01-01 = 甲子日
    const baseOffset = 0; // 甲子 = 六十甲子第0个
    const targetDate = new Date(year, month - 1, day);
    const diff = Math.round((targetDate - baseDate) / 86400000);
    const offset = ((baseOffset + diff) % 60 + 60) % 60;
    return {
      stem: D.HEAVENLY_STEMS[offset % 10],
      branch: D.EARTHLY_BRANCHES[offset % 12]
    };
  }

  // 时支
  function getHourBranch(hour) {
    // 子时：23-1点，丑：1-3点...
    const idx = Math.floor((hour + 1) / 2) % 12;
    return D.EARTHLY_BRANCHES[idx];
  }

  // 时干（五鼠遁：日干推时干）
  function getHourStem(dayStem, hourBranch) {
    // 甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
    const stemStartMap = { '甲':'甲','己':'甲','乙':'丙','庚':'丙','丙':'戊','辛':'戊','丁':'庚','壬':'庚','戊':'壬','癸':'壬' };
    const startStem = stemStartMap[dayStem];
    const startIdx = D.HEAVENLY_STEMS.indexOf(startStem);
    const branchIdx = D.EARTHLY_BRANCHES.indexOf(hourBranch);
    return D.HEAVENLY_STEMS[(startIdx + branchIdx) % 10];
  }

  // ============ 二、五行分析 ============
  function analyzeWuxing(bazi) {
    const counts = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    ['year', 'month', 'day', 'hour'].forEach(pillar => {
      const gz = bazi[pillar];
      const stem = gz[0], branch = gz[1];
      counts[D.WUXING_OF_STEM[stem]]++;
      counts[D.WUXING_OF_BRANCH[branch]]++;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    // 找最弱五行（喜用神简化版：补最弱）
    let minWx = '木', minVal = Infinity;
    let maxWx = '木', maxVal = 0;
    for (const [wx, v] of Object.entries(counts)) {
      if (v < minVal) { minVal = v; minWx = wx; }
      if (v > maxVal) { maxVal = v; maxWx = wx; }
    }
    // 日主强弱：同党=同五行(比劫)+生我者(印)，异党=我生者(食伤)+克我者(官杀)+我克者(财)
    const dayMasterWx = bazi.dayMasterWuxing;
    const sameParty = counts[dayMasterWx] + counts[getGeneratingWx(dayMasterWx)];
    const isStrong = sameParty >= 4;

    return {
      counts, total,
      strongest: maxWx,
      weakest: minWx,
      dayMaster: bazi.dayMaster,
      dayMasterWx,
      isStrong,
      // 喜用神简化：身强则克泄，身弱则生扶
      yongshen: isStrong ? getRestrainingWx(dayMasterWx) : getGeneratingWx(dayMasterWx),
      percentages: {
        '木': Math.round(counts['木'] / total * 100),
        '火': Math.round(counts['火'] / total * 100),
        '土': Math.round(counts['土'] / total * 100),
        '金': Math.round(counts['金'] / total * 100),
        '水': Math.round(counts['水'] / total * 100)
      }
    };
  }

  // 五行相生：A生B
  const SHENG = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
  // 五行相克：A克B
  const KE = { '木':'土','土':'水','水':'火','火':'金','金':'木' };

  function getGeneratedWx(wx) { return SHENG[wx]; } // 我生的
  function getGeneratingWx(wx) { // 生我的
    for (const [k, v] of Object.entries(SHENG)) if (v === wx) return k;
  }
  function getRestrainingWx(wx) { return KE[wx]; } // 我克的
  function getRestrainingMeWx(wx) { // 克我的
    for (const [k, v] of Object.entries(KE)) if (v === wx) return k;
  }

  // ============ 三、星座判定 ============
  function getConstellation(month, day) {
    const md = String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    for (const c of D.CONSTELLATIONS) {
      if (c.start <= c.end) {
        if (md >= c.start && md <= c.end) return c;
      } else {
        if (md >= c.start || md <= c.end) return c;
      }
    }
    return D.CONSTELLATIONS[0];
  }

  // ============ 四、生物钟三节律 ============
  function calcBiorhythm(birthDate, targetDate) {
    const days = Math.floor((targetDate - birthDate) / (1000 * 60 * 60 * 24));
    return {
      days,
      physical: Math.sin(2 * Math.PI * days / 23) * 100,    // 体力 23天
      emotional: Math.sin(2 * Math.PI * days / 28) * 100,    // 情绪 28天
      intellectual: Math.sin(2 * Math.PI * days / 33) * 100, // 智力 33天
      physicalDay: ((days % 23) + 23) % 23 + 1,
      emotionalDay: ((days % 28) + 28) % 28 + 1,
      intellectualDay: ((days % 33) + 33) % 33 + 1
    };
  }

  // ============ 五、风水命卦 ============
  function calcMingGua(year, gender) {
    // 简化命卦计算
    let sum = 0;
    const yStr = String(year);
    for (const ch of yStr) sum += parseInt(ch);
    let num = sum % 9;
    if (num === 0) num = 9;
    // 男命：11-num（2000年前）；女命：num+4
    // 简化处理
    let guaNum;
    if (gender === '男') {
      guaNum = (11 - num) % 9;
    } else {
      guaNum = (num + 4) % 9;
    }
    if (guaNum === 0) guaNum = 9;
    // 1坎 2坤 3震 4巽 5(男坤/女艮) 6乾 7兑 8艮 9离
    const guaMap = { 1:'坎', 2:'坤', 3:'震', 4:'巽', 5: gender==='男'?'坤':'艮', 6:'乾', 7:'兑', 8:'艮', 9:'离' };
    const gua = guaMap[guaNum];
    return { gua, ...D.FENGSHUI.guaData[gua] };
  }

  // ============ 六、当前节气 ============
  function getCurrentSolarTerm(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const terms = [
      { name:'小寒', m:1, d:6 },{ name:'大寒', m:1, d:20 },
      { name:'立春', m:2, d:4 },{ name:'雨水', m:2, d:19 },
      { name:'惊蛰', m:3, d:6 },{ name:'春分', m:3, d:21 },
      { name:'清明', m:4, d:5 },{ name:'谷雨', m:4, d:20 },
      { name:'立夏', m:5, d:6 },{ name:'小满', m:5, d:21 },
      { name:'芒种', m:6, d:6 },{ name:'夏至', m:6, d:21 },
      { name:'小暑', m:7, d:7 },{ name:'大暑', m:7, d:23 },
      { name:'立秋', m:8, d:8 },{ name:'处暑', m:8, d:23 },
      { name:'白露', m:9, d:8 },{ name:'秋分', m:9, d:23 },
      { name:'寒露', m:10, d:8 },{ name:'霜降', m:10, d:24 },
      { name:'立冬', m:11, d:7 },{ name:'小雪', m:11, d:22 },
      { name:'大雪', m:12, d:7 },{ name:'冬至', m:12, d:22 }
    ];
    let current = terms[0];
    for (const t of terms) {
      if (month > t.m || (month === t.m && day >= t.d)) current = t;
    }
    return current.name;
  }

  // ============ 七、十神计算 ============
  function calcTenGods(bazi) {
    const dayMaster = bazi.dayMaster;
    const gods = {};
    ['year','month','hour'].forEach(pillar => {
      const stem = bazi[pillar][0];
      gods[pillar + 'Stem'] = stem;
      gods[pillar + 'God'] = D.TEN_GODS[dayMaster][stem];
    });
    // 日主自身的十神（比肩）
    gods.dayMasterGod = '日主';
    return gods;
  }

  // ============ 八、纳音计算 ============
  function calcNayin(bazi) {
    const nayins = {};
    ['year','month','day','hour'].forEach(pillar => {
      const gz = bazi[pillar];
      nayins[pillar] = D.NAYIN_TABLE[gz] || '';
    });
    return nayins;
  }

  // ============ 九、大运推算 ============
  function calcDaYunFull(bazi, birthYear, birthMonth, birthDay) {
    const yearStem = bazi.year[0];
    const monthGanZhi = bazi.month; // 完整月柱，如"壬午"
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    if (window.XJG_ENGINE_CALCDAYUN) {
      return window.XJG_ENGINE_CALCDAYUN(yearStem, bazi.gender, monthGanZhi, birthDate);
    }
    return null;
  }

  // ============ 十、流年分析 ============
  function calcLiuNian(currentYear, bazi) {
    const stemIdx = (currentYear - 4) % 10;
    const branchIdx = (currentYear - 4) % 12;
    const STEMS = D.HEAVENLY_STEMS;
    const BRANCHES = D.EARTHLY_BRANCHES;
    const yearGan = STEMS[((stemIdx % 10) + 10) % 10];
    const yearZhi = BRANCHES[((branchIdx % 12) + 12) % 12];
    const yearGz = yearGan + yearZhi;

    // 流年十神
    const yearGod = D.TEN_GODS[bazi.dayMaster][yearGan];
    // 生肖
    const zodiac = D.ZODIAC_OF_BRANCH[yearZhi];
    // 与日柱关系
    const dayBranch = bazi.day[1];
    // 生肖合冲
    const chongMap = { '子':'午','丑':'未','寅':'申','卯':'酉','辰':'戌','巳':'亥','午':'子','未':'丑','申':'寅','酉':'卯','戌':'辰','亥':'巳' };
    const heMap = { '子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午' };
    const isChong = chongMap[yearZhi] === bazi.yearBranch;
    const isHe = heMap[yearZhi] === bazi.yearBranch;

    return { year: currentYear, ganZhi: yearGz, gan: yearGan, zhi: yearZhi, god: yearGod, zodiac, isChong, isHe };
  }

  // ============ 十一、神煞推算 ============
  function calcShensha(bazi) {
    const dayStem = bazi.dayMaster;
    const dayBranch = bazi.day[1];
    const result = [];
    // 天乙贵人
    const tianyi = D.SHENSHA.tianyi[dayStem];
    if (tianyi) {
      const branches = tianyi.split('');
      const has = branches.some(b => bazi.year.includes(b) || bazi.month.includes(b) || bazi.hour.includes(b));
      if (has) result.push({ name:'天乙贵人', desc:'逢凶化吉，贵人相助', level:'吉' });
    }
    // 文昌
    const wenchang = D.SHENSHA.wenchang[dayStem];
    if (wenchang) {
      const has = bazi.year.includes(wenchang) || bazi.month.includes(wenchang) || bazi.hour.includes(wenchang);
      if (has) result.push({ name:'文昌', desc:'才思敏捷，利学业考运', level:'吉' });
    }
    // 桃花
    const taohua = D.TAOhUA_MAP[dayBranch];
    if (taohua) {
      const has = bazi.year.includes(taohua) || bazi.month.includes(taohua) || bazi.hour.includes(taohua);
      if (has) result.push({ name:'桃花', desc:'人缘好，异性缘旺', level:'吉' });
    }
    return result;
  }

  // ============ 十二、综合分析主函数 ============
  function analyze(input) {
    const { name, gender, birthYear, birthMonth, birthDay, birthHour, bloodType, constitution, healthFocus } = input;

    // 1. 八字排盘
    const bazi = calcBaZi(birthYear, birthMonth, birthDay, birthHour || 12, gender);
    // 2. 五行分析
    const wuxing = analyzeWuxing(bazi);
    // 3. 十神
    const tenGods = calcTenGods(bazi);
    // 4. 纳音
    const nayin = calcNayin(bazi);
    // 5. 大运
    const dayun = calcDaYunFull(bazi, birthYear, birthMonth, birthDay);
    // 6. 流年
    const liunian = calcLiuNian(new Date().getFullYear(), bazi);
    // 7. 神煞
    const shensha = calcShensha(bazi);
    // 8. 星座
    const constellation = getConstellation(birthMonth, birthDay);
    // 9. 血型
    const blood = D.BLOOD_TYPES[bloodType];
    // 10. 体质
    const constit = D.CONSTITUTIONS[constitution] || D.CONSTITUTIONS['平和'];
    // 11. 生物钟
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const biorhythm = calcBiorhythm(birthDate, new Date());
    // 12. 风水命卦
    const fengshui = calcMingGua(birthYear, gender);
    // 13. 当前节气
    const currentTerm = getCurrentSolarTerm(new Date());
    // 14. 节气艾灸（优先使用完整版）
    const termMoxaSource = D.SOLAR_TERM_MOXA_FULL || D.SOLAR_TERM_MOXA;
    const termMoxa = termMoxaSource.find(m => m.term === currentTerm) || termMoxaSource[0];
    // 15. 药食方剂匹配（合并基础+扩充库）
    const allFormulas = [...(D.HERB_FORMULAS||[]), ...(D.HERB_FORMULAS_EXTRA||[])];
    const herbFormulas = allFormulas.filter(h => h.constitution === constitution);
    const herbFormula = herbFormulas[0] || D.HERB_FORMULAS[0];
    // 16. 喜用神五行数据
    const yongshenData = D.WUXING_DATA[wuxing.yongshen];
    // 17. 穿戴建议
    const wearData = (D.WEAR_MATRIX || {})[wuxing.yongshen] || { colors: yongshenData.color, materials:[], accessories:[] };
    // 18. 运动建议
    const exercise = (D.EXERCISE_MATRIX || {})[constitution] || D.EXERCISE_MATRIX['平和'];
    // 19. 产品推荐
    const recommendedProducts = matchProducts(wuxing.yongshen, constitution, currentTerm);

    return {
      name, gender, bloodType, constitution,
      bazi, wuxing, tenGods, nayin, dayun, liunian, shensha,
      constellation, blood, constit,
      biorhythm, fengshui, currentTerm, termMoxa, herbFormula, herbFormulas,
      yongshenData, wearData, exercise, recommendedProducts,
      ziwuliuzhu: D.ZIWULIUZHU || [],
      healthFocus: healthFocus || ''
    };
  }

  // ============ 八、产品匹配 ============
  function matchProducts(yongshen, constitution, solarTerm) {
    const products = [];
    // 艾制品
    products.push(D.PRODUCTS.find(p => p.id === 'p001'));
    products.push(D.PRODUCTS.find(p => p.id === 'p003'));
    // 五行手串
    const bracelet = D.PRODUCTS.find(p => p.category === '穿戴饰品' && p.wuxing === yongshen);
    if (bracelet) products.push(bracelet);
    // 体质茶包
    const tea = D.PRODUCTS.find(p => p.category === '本草食材' && p.constitution === constitution);
    if (tea) products.push(tea);
    return products;
  }

  // 导出
  window.XJG_ENGINE = { analyze, calcBaZi, analyzeWuxing, calcTenGods, calcNayin, calcDaYunFull, calcLiuNian, calcShensha, getConstellation, calcBiorhythm, calcMingGua, getCurrentSolarTerm };
})();
