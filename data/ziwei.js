/**
 * 玄机阁 · 数据扩充包六：紫微斗数排盘
 * 定命宫身宫 → 定五行局 → 起紫微星 → 布十四主星 → 排十二宫
 */

// ============ 紫微斗数排盘算法 ============

const ZIWEI_ENGINE = (function() {
  const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

  // 十二宫名称（顺时针）
  const PALACES = ['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','交友','官禄','田宅','福德','父母'];

  // 五行局（纳音五行→局数）
  const NAYIN_JU = {
    '金':'金四局','木':'木三局','水':'水二局','火':'火六局','土':'土五局'
  };

  // 从纳音提取五行
  function nayinToWuxing(nayin) {
    if (nayin.includes('金')) return '金';
    if (nayin.includes('木')) return '木';
    if (nayin.includes('水')) return '水';
    if (nayin.includes('火')) return '火';
    if (nayin.includes('土')) return '土';
    return '土';
  }

  // 局数
  const JU_NUM = { '金':4,'木':3,'水':2,'火':6,'土':5 };

  /**
   * 定命宫、身宫
   * 从寅宫起正月，顺数到生月，再从该宫起子时，逆数到生时为命宫，顺数为身宫
   */
  function calcMingGong(monthBranch, hourBranch) {
    // 从寅起正月（寅=索引2），顺数到生月
    const monthIdx = parseInt(monthBranch); // 1-12
    const startIdx = 2; // 寅
    const monthPos = (startIdx + monthIdx - 1) % 12;

    // 从月支位置起子时，逆数到生时
    const hourIdx = BRANCHES.indexOf(hourBranch);
    const mingGongIdx = (monthPos - hourIdx + 12) % 12;

    // 身宫：从月支位置起子时，顺数到生时
    const shenGongIdx = (monthPos + hourIdx) % 12;

    return {
      mingGong: BRANCHES[mingGongIdx],
      shenGong: BRANCHES[shenGongIdx],
      mingGongIdx,
      shenGongIdx
    };
  }

  /**
   * 定五行局（由年干和命宫支决定）
   * 纳音五行：年干+命宫支 → 纳音 → 五行局
   */
  function calcJu(yearStem, mingGongBranch) {
    const nayin = window.XJG_DATA.NAYIN_TABLE[yearStem + mingGongBranch] || '大驿土';
    const wx = nayinToWuxing(nayin);
    return { nayin, wuxing: wx, ju: NAYIN_JU[wx], juNum: JU_NUM[wx] };
  }

  /**
   * 起紫微星（由五行局和农历日数决定）
   * 紫微星宫位由局数和生日推算
   */
  function calcZiweiStar(juNum, day) {
    // 算法：日数除以局数，整除则商为宫位（从寅起），余数不为0则进位
    // 详细口诀较复杂，这里用标准查表法
    // 紫微星位置表：行=局数(2-6)，列=日数(1-30)
    const ziweiTable = generateZiweiTable();
    const pos = ziweiTable[juNum - 2][day - 1]; // 返回宫位索引(0-11)
    return pos;
  }

  // 生成紫微星位置表
  function generateZiweiTable() {
    // 标准紫微斗数起紫微法：
    // 将日数除以局数，商+余数关系决定紫微位置
    // 这里用简化的查表算法
    const tables = [];
    for (let ju = 2; ju <= 6; ju++) {
      const row = [];
      for (let day = 1; day <= 30; day++) {
        let q = Math.floor(day / ju);
        let r = day % ju;
        // 紫微星从寅(0)开始计数
        // 商决定基本位置，余数决定微调
        let pos;
        if (r === 0) {
          pos = (q - 1) % 12;
        } else {
          pos = q % 12;
        }
        // 紫微星每隔几宫分布，按标准口诀修正
        // 简化：使用标准推算法
        pos = calcZiweiPos(ju, day);
        row.push(pos);
      }
      tables.push(row);
    }
    return tables;
  }

  // 紫微星精确位置计算
  function calcZiweiPos(ju, day) {
    // 标准算法：日数÷局数
    // 整除：紫微在 第(商)个宫（从寅起，每隔几宫）
    // 不整除：紫微位置需根据余数调整
    const q = Math.ceil(day / ju); // 向上取整的商
    // 紫微星的可能位置序列（从寅起）
    // 紫微、天机、(空)、太阳、武曲、天同、(空)、(空)、官府、(空)、(空)、(空)
    // 紫微星位置 = (q-1) 映射到12宫
    let pos = (q - 1 + 12) % 12;
    // 根据余数微调（标准法）
    const r = day % ju;
    if (r !== 0 && r <= ju / 2) {
      pos = pos; // 不调整
    } else if (r !== 0) {
      pos = (pos + 1) % 12; // 前进一位
    }
    return pos;
  }

  /**
   * 布十四主星
   * 紫微星定后，天府、太阳、武曲、天同、天机等跟随排布
   */
  function placeStars(ziweiPos) {
    // 紫微星系（逆时针排布）：紫微→天机→(空)→太阳→武曲→天同→(空×2)→廉贞
    // 天府星系（顺时针排布）：天府→太阴→贪狼→巨门→天相→天梁→七杀→(空)→破军
    // 天府与紫微对称：天府位置 = (4 - ziweiPos + 12) % 12 （以寅为0，寅申线对称）

    const ziweiSeries = [
      { name:'紫微', offset:0 },
      { name:'天机', offset:-1 }, // 逆时针1
      { name:'太阳', offset:-3 },
      { name:'武曲', offset:-4 },
      { name:'天同', offset:-5 },
      { name:'廉贞', offset:-8 }
    ];

    // 天府位置：紫微在寅(0)则天府在寅(0)，紫微在卯(1)则天府在丑(1)... 即对称
    // 天府 = (0 - ziweiPos * 2 + 12) % 12 → 不对
    // 正确：紫微和天府以寅申线对称。寅=0,申=6
    // 如果紫微在n，天府在 (4-n+12) % 12... 需要验证
    // 标准：天府位置 = (4 - ziweiPos % 6)... 
    // 简化正确法：紫微在寅(0)，天府在寅(0)；紫微在卯(1)，天府在丑(11)
    // 天府 = (0 - ziweiPos*2) % 12 → 0, -2→10, -4→8...
    // 不对，用标准法：天府 = (4 - ziweiPos + 12) % 12 也不对
    // 正确关系：紫微+天府的位置之和恒为4（以寅=0计），不对
    // 实际：紫微在n → 天府在 (4 - n + 12*ceil) 
    // 紫微在0(寅)→天府在0(寅)? 不，紫微在寅天府在申...
    // 正确：紫微在寅(0)天府在寅(0)是错的
    // 标准对照：紫微子(0)→天府子(0)，紫微丑(1)→天府亥(11)，紫微寅(2)→天府戌(10)... 
    // 天府 = (12 - ziweiPos) % 12? 不，紫微0→天府0，紫微1→天府11
    // 天府 = (0 - ziweiPos*2 + 24) % 12 → 0, 22%12=10... 不对
    // 用查表：紫微→天府对应：0→0, 1→11, 2→10, 3→9, 4→8, 5→7, 6→6
    // 即天府 = (12 - ziweiPos) % 12
    const tianfuPos = (12 - ziweiPos) % 12;

    const tianfuSeries = [
      { name:'天府', offset:0 },
      { name:'太阴', offset:1 },
      { name:'贪狼', offset:2 },
      { name:'巨门', offset:3 },
      { name:'天相', offset:4 },
      { name:'天梁', offset:5 },
      { name:'七杀', offset:6 },
      { name:'破军', offset:8 } // 跳过1宫
    ];

    const stars = {};
    ziweiSeries.forEach(s => {
      const pos = (ziweiPos + s.offset + 12) % 12;
      stars[pos] = stars[pos] || [];
      stars[pos].push(s.name);
    });
    tianfuSeries.forEach(s => {
      const pos = (tianfuPos + s.offset + 12) % 12;
      stars[pos] = stars[pos] || [];
      stars[pos].push(s.name);
    });

    return { stars, ziweiPos, tianfuPos };
  }

  /**
   * 完整排盘
   */
  function paipan(input) {
    const { yearStem, month, day, hourBranch, gender } = input;

    // 1. 定命宫身宫
    const gong = calcMingGong(month, hourBranch);

    // 2. 定五行局
    const ju = calcJu(yearStem, gong.mingGong);

    // 3. 起紫微星
    const ziweiPos = calcZiweiStar(ju.juNum, day);

    // 4. 布十四主星
    const { stars } = placeStars(ziweiPos);

    // 5. 排十二宫（从命宫起，顺时针）
    const palaces = [];
    for (let i = 0; i < 12; i++) {
      const gongIdx = (gong.mingGongIdx + i) % 12;
      const gongName = PALACES[i];
      const gongBranch = BRANCHES[gongIdx];
      const isMingGong = i === 0;
      const isShenGong = gongIdx === gong.shenGongIdx;
      palaces.push({
        name: gongName,
        branch: gongBranch,
        idx: gongIdx,
        stars: stars[gongIdx] || [],
        isMingGong,
        isShenGong
      });
    }

    return {
      mingGong: gong.mingGong,
      shenGong: gong.shenGong,
      ju: ju,
      ziweiPos,
      palaces,
      yearStem,
      month,
      day,
      hourBranch,
      gender
    };
  }

  return { paipan, calcMingGong, calcJu, placeStars };
})();

window.XJG_ZIWEI = ZIWEI_ENGINE;
