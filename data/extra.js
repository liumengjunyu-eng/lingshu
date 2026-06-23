/**
 * 玄机阁 · 数据扩充包四：方剂/节气/运动完整数据
 */

// ============ 扩充药食同源方剂（补充16方，共24方）============
const HERB_FORMULAS_EXTRA = [
  { id:'hf009', name:'八宝粥', source:'民间食疗', constitution:'平和', wuxing:'土', herbs:[{name:'山药',dose:'30g'},{name:'莲子',dose:'30g'},{name:'枸杞',dose:'15g'},{name:'百合',dose:'20g'}], ingredients:['糯米100g','红枣6枚','冰糖适量'], method:'所有材料同煮成粥', efficacy:'平补脾胃、养心安神', taboo:'无明显禁忌', solarTerms:['四季皆宜'] },
  { id:'hf010', name:'莲子百合羹', source:'《本草纲目》', constitution:'平和', wuxing:'水', herbs:[{name:'莲子',dose:'30g'},{name:'百合',dose:'20g'}], ingredients:['冰糖适量'], method:'莲子去心与百合同炖至烂', efficacy:'养心安神、润肺滋阴', taboo:'便秘者少食', solarTerms:['秋分','寒露'] },
  { id:'hf011', name:'黑芝麻核桃糊', source:'民间食疗', constitution:'阳虚', wuxing:'水', herbs:[{name:'黑芝麻',dose:'50g'},{name:'核桃',dose:'30g'}], ingredients:['蜂蜜适量'], method:'黑芝麻核桃炒香磨粉，沸水冲调', efficacy:'补肾乌发、温阳润肠', taboo:'腹泻者不宜', solarTerms:['冬至','小寒','大寒'] },
  { id:'hf012', name:'山楂红糖水', source:'民间食疗', constitution:'血瘀', wuxing:'木', herbs:[{name:'山楂',dose:'30g'},{name:'红糖',dose:'20g'}], ingredients:['生姜2片'], method:'山楂煎煮15分钟，加红糖调味', efficacy:'活血化瘀、温经止痛', taboo:'胃酸过多者少饮', solarTerms:['立春','雨水'] },
  { id:'hf013', name:'薄荷菊花饮', source:'民间食疗', constitution:'气郁', wuxing:'木', herbs:[{name:'薄荷',dose:'5g'},{name:'菊花',dose:'10g'},{name:'枸杞',dose:'10g'}], ingredients:['冰糖适量'], method:'沸水冲泡闷饮', efficacy:'疏肝清热、明目解郁', taboo:'体寒者少饮', solarTerms:['谷雨','立夏'] },
  { id:'hf014', name:'山药茯苓粥', source:'《本草纲目》化裁', constitution:'痰湿', wuxing:'土', herbs:[{name:'山药',dose:'50g'},{name:'茯苓',dose:'20g'},{name:'薏苡仁',dose:'30g'}], ingredients:['粳米100g'], method:'所有材料同煮成粥', efficacy:'健脾利湿、化痰消浊', taboo:'阴虚者不宜多食', solarTerms:['谷雨','白露'] },
  { id:'hf015', name:'玉竹沙参饮', source:'《温病条辨》化裁', constitution:'阴虚', wuxing:'水', herbs:[{name:'玉竹',dose:'15g'},{name:'沙参',dose:'15g'},{name:'麦冬',dose:'10g'}], ingredients:['冰糖适量'], method:'药材煎煮20分钟取汁', efficacy:'养阴润肺、生津止渴', taboo:'痰湿体质不宜', solarTerms:['秋分','寒露','霜降'] },
  { id:'hf016', name:'桂圆红枣茶', source:'民间食疗', constitution:'气虚', wuxing:'火', herbs:[{name:'桂圆',dose:'15g'},{name:'红枣',dose:'8枚'},{name:'枸杞',dose:'10g'}], ingredients:['红糖适量'], method:'沸水冲泡或小火煮15分钟', efficacy:'补益心脾、养血安神', taboo:'上火感冒者不宜', solarTerms:['冬至','小寒'] },
  { id:'hf017', name:'四君子粥', source:'《太平惠民和剂局方》化裁', constitution:'气虚', wuxing:'土', herbs:[{name:'党参',dose:'15g'},{name:'白术',dose:'10g'},{name:'茯苓',dose:'10g'},{name:'甘草',dose:'5g'}], ingredients:['粳米100g'], method:'药材煎汁后与米同煮成粥', efficacy:'益气健脾', taboo:'阴虚火旺者不宜', solarTerms:['四季皆宜'] },
  { id:'hf018', name:'陈皮茯苓茶', source:'民间食疗', constitution:'痰湿', wuxing:'土', herbs:[{name:'陈皮',dose:'5g'},{name:'茯苓',dose:'15g'}], ingredients:['蜂蜜适量'], method:'沸水冲泡闷饮', efficacy:'理气化痰、健脾渗湿', taboo:'阴虚口干者少饮', solarTerms:['四季皆宜'] },
  { id:'hf019', name:'藏红花茶', source:'《本草纲目》', constitution:'血瘀', wuxing:'木', herbs:[{name:'藏红花',dose:'5-10根'}], ingredients:['蜂蜜适量'], method:'沸水冲泡闷饮', efficacy:'活血化瘀、解郁安神', taboo:'孕妇禁用，月经量多者不宜', solarTerms:['春分','清明'] },
  { id:'hf020', name:'当归羊肉汤', source:'《金匮要略》', constitution:'阳虚', wuxing:'火', herbs:[{name:'当归',dose:'15g'},{name:'生姜',dose:'30g'},{name:'黄芪',dose:'30g'}], ingredients:['羊肉500g','料酒适量'], method:'羊肉焯水后与药材同炖2小时', efficacy:'温阳补气、养血活血', taboo:'阴虚火旺者不宜', solarTerms:['立冬','大雪','冬至'] },
  { id:'hf021', name:'桑葚枸杞饮', source:'民间食疗', constitution:'阴虚', wuxing:'水', herbs:[{name:'桑葚',dose:'20g'},{name:'枸杞',dose:'15g'}], ingredients:['冰糖适量'], method:'沸水冲泡闷饮', efficacy:'滋阴补血、益肾明目', taboo:'脾胃虚寒者少饮', solarTerms:['谷雨','立夏'] },
  { id:'hf022', name:'三豆饮', source:'民间食疗', constitution:'湿热', wuxing:'火', herbs:[{name:'绿豆',dose:'30g'},{name:'赤小豆',dose:'30g'},{name:'黑豆',dose:'30g'}], ingredients:['冰糖适量'], method:'三豆同煮至烂', efficacy:'清热解毒、利湿消肿', taboo:'脾胃虚寒者少食', solarTerms:['夏至','小暑','大暑'] },
  { id:'hf023', name:'黄芪防风茶', source:'《丹溪心法》化裁', constitution:'特禀', wuxing:'金', herbs:[{name:'黄芪',dose:'20g'},{name:'防风',dose:'5g'},{name:'白术',dose:'10g'}], ingredients:['红枣3枚'], method:'药材煎煮20分钟取汁', efficacy:'益气固表、防风抗敏', taboo:'阴虚火旺者不宜', solarTerms:['四季皆宜'] },
  { id:'hf024', name:'核桃杜仲汤', source:'民间食疗', constitution:'阳虚', wuxing:'水', herbs:[{name:'核桃',dose:'30g'},{name:'杜仲',dose:'15g'}], ingredients:['猪腰1对','盐适量'], method:'猪腰处理干净与药材同炖1小时', efficacy:'补肾壮腰、温阳固精', taboo:'阴虚火旺者不宜', solarTerms:['冬至','小寒'] }
];

// ============ 24节气完整艾灸方案 ============
const SOLAR_TERM_MOXA_FULL = [
  { term:'立春', date:'2/4', points:['太冲','期门','肝俞'], focus:'疏肝理气，助阳气升发', element:'木' },
  { term:'雨水', date:'2/19', points:['太冲','三阴交'], focus:'疏肝健脾，防湿气困脾', element:'木' },
  { term:'惊蛰', date:'3/6', points:['太冲','阳陵泉','丘墟'], focus:'平肝潜阳，清泻肝火', element:'木' },
  { term:'春分', date:'3/21', points:['太冲','阳陵泉','足三里'], focus:'阴阳调和，疏肝健脾', element:'木' },
  { term:'清明', date:'4/5', points:['阴陵泉','足三里','丰隆'], focus:'健脾化湿，祛痰通络', element:'土' },
  { term:'谷雨', date:'4/20', points:['阴陵泉','足三里','三阴交'], focus:'健脾祛湿，养胃和中', element:'土' },
  { term:'立夏', date:'5/6', points:['神门','内关','心俞'], focus:'养心安神，清心除烦', element:'火' },
  { term:'小满', date:'5/21', points:['神门','内关','足三里'], focus:'养心安神，健脾利湿', element:'火' },
  { term:'芒种', date:'6/6', points:['阴陵泉','丰隆','足三里'], focus:'健脾化湿，清热利湿', element:'土' },
  { term:'夏至', date:'6/21', points:['命门','关元','神阙'], focus:'冬病夏治，培补阳气，夏至灸', element:'火' },
  { term:'小暑', date:'7/7', points:['丰隆','阴陵泉','足三里'], focus:'清热化湿，健脾祛暑', element:'土' },
  { term:'大暑', date:'7/23', points:['丰隆','阴陵泉','大椎'], focus:'清热化湿，祛暑降火', element:'土' },
  { term:'立秋', date:'8/8', points:['肺俞','尺泽','太渊'], focus:'润肺养阴，收敛肺气', element:'金' },
  { term:'处暑', date:'8/23', points:['肺俞','尺泽','足三里'], focus:'润肺生津，健脾益气', element:'金' },
  { term:'白露', date:'9/8', points:['太溪','三阴交','肺俞'], focus:'滋阴润燥，养肺固表', element:'金' },
  { term:'秋分', date:'9/23', points:['太溪','三阴交','足三里'], focus:'滋阴润燥，阴阳调和', element:'金' },
  { term:'寒露', date:'10/8', points:['关元','命门','足三里'], focus:'温阳固本，预防寒邪', element:'土' },
  { term:'霜降', date:'10/24', points:['关元','命门','肺俞'], focus:'温阳散寒，补肺固表', element:'土' },
  { term:'立冬', date:'11/7', points:['肾俞','命门','太溪'], focus:'补肾藏精，温阳固本', element:'水' },
  { term:'小雪', date:'11/22', points:['肾俞','命门','关元'], focus:'温肾固精，培元固本', element:'水' },
  { term:'大雪', date:'12/7', points:['命门','关元','神阙'], focus:'温阳补肾，散寒固本', element:'水' },
  { term:'冬至', date:'12/22', points:['神阙','关元','命门'], focus:'培元固本，冬至灸（一年中最重要艾灸日）', element:'水' },
  { term:'小寒', date:'1/6', points:['命门','大椎','关元'], focus:'温阳散寒，补肾壮阳', element:'水' },
  { term:'大寒', date:'1/20', points:['命门','大椎','肾俞'], focus:'温阳散寒，固肾培元', element:'水' }
];

// ============ 完整运动调运矩阵 ============
const EXERCISE_MATRIX = {
  '气虚': { sports:['太极','八段锦','散步','瑜伽'], time:'辰时(7-9点)', intensity:'低强度', frequency:'每日30分钟', note:'不宜大汗，微微出汗即可' },
  '阳虚': { sports:['慢跑','快走','晒太阳','瑜伽'], time:'巳时(9-11点)', intensity:'中低强度', frequency:'每日40分钟', note:'宜上午晒太阳运动，温补阳气' },
  '阴虚': { sports:['游泳','瑜伽','冥想','太极'], time:'酉时(17-19点)', intensity:'中低强度', frequency:'每周4次', note:'不宜剧烈出汗，宜静养' },
  '痰湿': { sports:['有氧运动','快走','跳绳','游泳'], time:'辰时(7-9点)', intensity:'中高强度', frequency:'每周5次', note:'需较大运动量化痰祛湿' },
  '湿热': { sports:['游泳','骑行','球类','跑步'], time:'申时(15-17点)', intensity:'中高强度', frequency:'每周4次', note:'宜大运动量清热利湿' },
  '血瘀': { sports:['舞蹈','健美操','拉伸','跑步'], time:'卯时(5-7点)', intensity:'中等强度', frequency:'每周4次', note:'宜舒展活血，促进气血运行' },
  '气郁': { sports:['户外徒步','团体运动','骑行','游泳'], time:'午时(11-13点)', intensity:'中等强度', frequency:'每周3次', note:'宜户外群组运动，舒解郁气' },
  '特禀': { sports:['太极','八段锦','散步','瑜伽'], time:'辰时(7-9点)', intensity:'低强度', frequency:'每日30分钟', note:'宜轻柔运动，增强体质' },
  '平和': { sports:['各类运动均可'], time:'灵活', intensity:'中等强度', frequency:'每周4次', note:'均衡运动，顺应四时' }
};

// ============ 穿戴色彩详细矩阵 ============
const WEAR_MATRIX = {
  '木': { colors:['青色','绿色','翠色'], materials:['棉麻','木质','竹质'], accessories:['绿檀手串','翡翠','橄榄石'], avoid:['白色（金克木）'], scenes:{ '职场':'绿色系衬衫/外套', '约会':'翠色配饰点缀', '重要日':'绿色木质手串+绿色领带/丝巾' } },
  '火': { colors:['红色','紫色','粉色','橙色'], materials:['丝质','化纤','树脂'], accessories:['红玛瑙','石榴石','紫水晶'], avoid:['黑色（水克火）'], scenes:{ '职场':'红色领带/丝巾点缀', '约会':'粉色/紫色系服饰', '重要日':'红玛瑙手串+红色配饰' } },
  '土': { colors:['黄色','棕色','咖色','米色'], materials:['陶瓷','皮质','棉质'], accessories:['黄水晶','琥珀','虎眼石'], avoid:['绿色（木克土）'], scenes:{ '职场':'棕色系商务装', '约会':'米色/驼色温暖系', '重要日':'黄水晶手串+咖色配饰' } },
  '金': { colors:['白色','银色','金色','浅灰'], materials:['金属','珍珠','贝壳'], accessories:['金银饰品','白水晶','月光石'], avoid:['红色（火克金）'], scenes:{ '职场':'白色/银色正装', '约会':'浅金/银色优雅系', '重要日':'金银饰品+白色系搭配' } },
  '水': { colors:['黑色','蓝色','深灰'], materials:['水晶','丝绒','皮革'], accessories:['黑曜石','海蓝宝','青金石'], avoid:['黄色（土克水）'], scenes:{ '职场':'深蓝/黑色干练系', '约会':'蓝色系沉静搭配', '重要日':'黑曜石手串+蓝色配饰' } }
};

// ============ 子午流注作息表 ============
const ZIWULIUZHU = [
  { time:'子时(23-1点)', meridian:'胆经', activity:'宜入睡养胆，造血排毒', advice:'必须23点前入睡' },
  { time:'丑时(1-3点)', meridian:'肝经', activity:'肝脏排毒修复', advice:'深度睡眠，勿熬夜' },
  { time:'寅时(3-5点)', meridian:'肺经', activity:'肺经运行，气血分配', advice:'保持安睡' },
  { time:'卯时(5-7点)', meridian:'大肠经', activity:'宜起床排便', advice:'起床饮水排便，晨练' },
  { time:'辰时(7-9点)', meridian:'胃经', activity:'宜进食早餐', advice:'吃好早餐，胃经最旺' },
  { time:'巳时(9-11点)', meridian:'脾经', activity:'运化吸收', advice:'工作学习效率最高' },
  { time:'午时(11-13点)', meridian:'心经', activity:'心经最旺', advice:'午休15-30分钟养心' },
  { time:'未时(13-15点)', meridian:'小肠经', activity:'吸收营养', advice:'宜清淡午餐' },
  { time:'申时(15-17点)', meridian:'膀胱经', activity:'排毒利尿', advice:'多喝水，运动最佳时段' },
  { time:'酉时(17-19点)', meridian:'肾经', activity:'肾经运行', advice:'宜休息，艾灸养肾' },
  { time:'戌时(19-21点)', meridian:'心包经', activity:'心包经运行', advice:'宜散步放松，艾灸养心' },
  { time:'亥时(21-23点)', meridian:'三焦经', activity:'内分泌免疫调节', advice:'准备入睡，泡脚安神' }
];

// 导出
Object.assign(window.XJG_DATA, {
  HERB_FORMULAS_EXTRA, SOLAR_TERM_MOXA_FULL, EXERCISE_MATRIX, WEAR_MATRIX, ZIWULIUZHU
});
