/**
 * 玄机阁 · 分析引擎（精简独立版）
 * 从 index.html 提取的分析引擎及所依赖的数据常量
 * 原样提取，保持原始函数名与逻辑不变
 *
 * 组成：
 *   1. 数据常量（来自 data/data.js）
 *   2. 命理核心数据（来自 data/mingli.js）：十神表、纳音表、神煞表、大运推算
 *   3. 扩充数据（来自 data/extra.js）：方剂/节气艾灸/运动/穿戴/子午流注
 *   4. 分析引擎主代码（来自 js/engine.js）
 */

// ============================================================
// 一、数据常量（来自 data/data.js）
// ============================================================

// ============ 天干地支基础数据 ============
const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const WUXING_OF_STEM = {
  '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'
};
const WUXING_OF_BRANCH = {
  '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'
};
const YINYANG_OF_STEM = {
  '甲':'阳','乙':'阴','丙':'阳','丁':'阴','戊':'阳','己':'阴','庚':'阳','辛':'阴','壬':'阳','癸':'阴'
};
const ZODIAC_OF_BRANCH = {
  '子':'鼠','丑':'牛','寅':'虎','卯':'兔','辰':'龙','巳':'蛇','午':'马','未':'羊','申':'猴','酉':'鸡','戌':'狗','亥':'猪'
};

// ============ 五行对应数据 ============
const WUXING_DATA = {
  '木': { color: ['青','绿'], season: '春', direction: '东', organ: '肝胆', emotion: '怒', flavor: '酸', foods: ['菠菜','芹菜','枸杞','菊花','玫瑰花'] },
  '火': { color: ['红','紫'], season: '夏', direction: '南', organ: '心小肠', emotion: '喜', flavor: '苦', foods: ['红枣','桂圆','莲子','苦瓜'] },
  '土': { color: ['黄','棕'], season: '长夏', direction: '中', organ: '脾胃', emotion: '思', flavor: '甘', foods: ['山药','小米','南瓜','大枣','茯苓'] },
  '金': { color: ['白','银','金'], season: '秋', direction: '西', organ: '肺大肠', emotion: '悲', flavor: '辛', foods: ['百合','银耳','白果','雪梨'] },
  '水': { color: ['黑','蓝'], season: '冬', direction: '北', organ: '肾膀胱', emotion: '恐', flavor: '咸', foods: ['黑芝麻','黑豆','桑葚','核桃'] }
};

// ============ 星座数据 ============
const CONSTELLATIONS = [
  { name: '白羊座', start: '03-21', end: '04-19', element: '火', ruler: '火星', traits: '热情冲动、勇敢直率、领导力强', luckyColor: '红色' },
  { name: '金牛座', start: '04-20', end: '05-20', element: '土', ruler: '金星', traits: '稳重务实、耐心执着、重视物质', luckyColor: '绿色' },
  { name: '双子座', start: '05-21', end: '06-21', element: '风', ruler: '水星', traits: '聪明灵活、善于沟通、好奇心强', luckyColor: '黄色' },
  { name: '巨蟹座', start: '06-22', end: '07-22', element: '水', ruler: '月亮', traits: '敏感细腻、重视家庭、保护欲强', luckyColor: '银色' },
  { name: '狮子座', start: '07-23', end: '08-22', element: '火', ruler: '太阳', traits: '自信大方、有领导力、爱表现', luckyColor: '金色' },
  { name: '处女座', start: '08-23', end: '09-22', element: '土', ruler: '水星', traits: '完美主义、细致严谨、分析力强', luckyColor: '藏青' },
  { name: '天秤座', start: '09-23', end: '10-23', element: '风', ruler: '金星', traits: '优雅和谐、追求平衡、社交力强', luckyColor: '粉色' },
  { name: '天蝎座', start: '10-24', end: '11-22', element: '水', ruler: '冥王星', traits: '深沉神秘、洞察力强、意志坚定', luckyColor: '深红' },
  { name: '射手座', start: '11-23', end: '12-21', element: '火', ruler: '木星', traits: '乐观自由、热爱冒险、哲思型', luckyColor: '紫色' },
  { name: '摩羯座', start: '12-22', end: '01-19', element: '土', ruler: '土星', traits: '务实上进、自律坚忍、目标明确', luckyColor: '黑色' },
  { name: '水瓶座', start: '01-20', end: '02-18', element: '风', ruler: '天王星', traits: '独立创新、理性博爱、特立独行', luckyColor: '电光蓝' },
  { name: '双鱼座', start: '02-19', end: '03-20', element: '水', ruler: '海王星', traits: '浪漫感性、富有同情、直觉敏锐', luckyColor: '海蓝' }
];

// ============ 血型数据 ============
const BLOOD_TYPES = {
  'A': {
    personality: '细致谨慎、责任心强、追求完美，易紧张焦虑',
    diet: { good: ['蔬菜','豆类','谷物','鱼类'], avoid: ['红肉','乳制品','小麦'] },
    healthRisk: '心血管压力、胃部不适',
    exercise: '瑜伽、太极、散步等舒缓运动',
    compatibleBlood: ['A','O']
  },
  'B': {
    personality: '乐观开朗、行动力强、创造力丰富，易三分钟热度',
    diet: { good: ['肉类','乳制品','蔬菜','蛋类'], avoid: ['玉米','花生','芝麻'] },
    healthRisk: '代谢紊乱、血糖波动',
    exercise: '网球、徒步、骑行等中等强度',
    compatibleBlood: ['B','O']
  },
  'O': {
    personality: '自信果断、领导力强、慷慨大方，易冲动急躁',
    diet: { good: ['瘦肉','鱼类','蔬菜','水果'], avoid: ['乳制品','豆类','谷物过量'] },
    healthRisk: '胃酸过多、甲状腺问题',
    exercise: '跑步、游泳、武术等高强度有氧',
    compatibleBlood: ['O']
  },
  'AB': {
    personality: '理性智慧、直觉敏锐、适应力强，内心较复杂',
    diet: { good: ['海鲜','乳制品','豆腐','蔬菜','水果'], avoid: ['红肉','玉米','芸豆'] },
    healthRisk: '免疫力波动、心脏负担',
    exercise: '瑜伽、游泳、太极等柔和运动',
    compatibleBlood: ['A','B','AB','O']
  }
};

// ============ 中医九种体质 ============
const CONSTITUTIONS = {
  '平和': {
    desc: '体态适中、面色润泽、精力充沛、睡眠良好',
    tune: '日常平补，顺应四时',
    moxa: { points: ['足三里'], method: '保健灸，每周1-2次' },
    diet: { good: ['山药','莲子','枸杞','百合'], recipe: '八宝粥' },
    wuxing: null
  },
  '气虚': {
    desc: '容易疲乏、气短懒言、自汗、易感冒',
    tune: '补益脾气，培补元气',
    moxa: { points: ['足三里','气海','关元'], method: '温和灸，每日或隔日，每穴15分钟' },
    diet: { good: ['黄芪','党参','山药','大枣','茯苓'], recipe: '黄芪鸡汤' },
    wuxing: '土'
  },
  '阳虚': {
    desc: '畏寒怕冷、手足不温、面色柔白、喜热饮',
    tune: '温补阳气，驱寒暖身',
    moxa: { points: ['关元','命门','神阙'], method: '隔姜灸或温和灸，每日，每穴20分钟' },
    diet: { good: ['生姜','肉桂','桂圆','韭菜子','核桃'], recipe: '当归生姜羊肉汤' },
    wuxing: '火'
  },
  '阴虚': {
    desc: '手足心热、口燥咽干、喜冷饮、大便干燥',
    tune: '滋阴清热，润燥养津',
    moxa: { points: ['三阴交','太溪','复溜'], method: '温和灸（轻灸），隔日，每穴10分钟' },
    diet: { good: ['百合','银耳','枸杞','桑葚','玉竹'], recipe: '百合银耳羹' },
    wuxing: '水'
  },
  '痰湿': {
    desc: '体形肥胖、腹部肥满、口黏苔腻、嗜食肥甘',
    tune: '健脾化湿，化痰降浊',
    moxa: { points: ['丰隆','中脘','阴陵泉'], method: '温和灸，每日，每穴15分钟' },
    diet: { good: ['薏苡仁','赤小豆','陈皮','茯苓','荷叶'], recipe: '薏仁赤豆汤' },
    wuxing: '土'
  },
  '湿热': {
    desc: '面垢油光、口苦口干、身重困倦、易生痤疮',
    tune: '清热化湿，利水渗湿',
    moxa: { points: ['阴陵泉','曲池','大椎'], method: '温和灸，隔日，每穴15分钟' },
    diet: { good: ['绿豆','薏苡仁','苦瓜','马齿苋'], recipe: '绿豆薏仁汤' },
    wuxing: '火'
  },
  '血瘀': {
    desc: '肤色晦暗、唇色偏紫、易有瘀斑、健忘',
    tune: '活血化瘀，行气通络',
    moxa: { points: ['血海','膈俞','三阴交'], method: '温和灸，隔日，每穴15分钟' },
    diet: { good: ['山楂','桃仁','玫瑰花','藏红花','黑木耳'], recipe: '玫瑰花茶' },
    wuxing: '木'
  },
  '气郁': {
    desc: '情绪低沉、多愁善感、胸闷叹息、易失眠',
    tune: '疏肝理气，解郁安神',
    moxa: { points: ['太冲','期门','膻中'], method: '温和灸，隔日，每穴15分钟' },
    diet: { good: ['玫瑰花','佛手','陈皮','薄荷','菊花'], recipe: '玫瑰佛手茶' },
    wuxing: '木'
  },
  '特禀': {
    desc: '过敏体质、易患鼻炎哮喘、皮肤敏感',
    tune: '益气固表，调和营卫',
    moxa: { points: ['足三里','肺俞','风池'], method: '温和灸，隔日，每穴15分钟' },
    diet: { good: ['黄芪','防风','白术','红枣'], recipe: '玉屏风汤' },
    wuxing: '金'
  }
};

// ============ 药食同源方剂库 ============
const HERB_FORMULAS = [
  { id:'hf001', name:'黄芪鸡汤', source:'《本草纲目》化裁', constitution:'气虚', wuxing:'土', herbs:[{name:'黄芪',dose:'30g'},{name:'党参',dose:'15g'},{name:'红枣',dose:'10枚'}], ingredients:['母鸡1只','生姜3片','盐适量'], method:'鸡洗净与药材同炖2小时，调味即可', efficacy:'补中益气、健脾养胃', taboo:'感冒发热者不宜', solarTerms:['四季皆宜'] },
  { id:'hf002', name:'当归生姜羊肉汤', source:'《金匮要略》', constitution:'阳虚', wuxing:'火', herbs:[{name:'当归',dose:'15g'},{name:'生姜',dose:'30g'}], ingredients:['羊肉500g','料酒适量'], method:'羊肉焯水后与药材同煮1.5小时', efficacy:'温阳散寒、补血活血', taboo:'阴虚火旺者不宜', solarTerms:['立冬','大雪','冬至','小寒','大寒'] },
  { id:'hf003', name:'百合银耳羹', source:'民间食疗', constitution:'阴虚', wuxing:'水', herbs:[{name:'百合',dose:'20g'},{name:'银耳',dose:'1朵'},{name:'枸杞',dose:'15g'}], ingredients:['冰糖适量'], method:'银耳泡发撕碎，与百合枸杞炖煮1小时', efficacy:'滋阴润肺、养心安神', taboo:'风寒咳嗽者不宜', solarTerms:['白露','秋分','寒露','霜降'] },
  { id:'hf004', name:'薏仁赤豆汤', source:'民间食疗', constitution:'痰湿', wuxing:'土', herbs:[{name:'薏苡仁',dose:'50g'},{name:'赤小豆',dose:'50g'},{name:'陈皮',dose:'5g'}], ingredients:['冰糖适量'], method:'食材浸泡后煮沸，小火慢炖1小时', efficacy:'健脾祛湿、利水消肿', taboo:'孕妇慎用', solarTerms:['谷雨','立夏','芒种','小暑'] },
  { id:'hf005', name:'绿豆薏仁汤', source:'民间食疗', constitution:'湿热', wuxing:'火', herbs:[{name:'绿豆',dose:'50g'},{name:'薏苡仁',dose:'50g'}], ingredients:['冰糖适量'], method:'绿豆薏仁同煮至烂', efficacy:'清热利湿、解毒消暑', taboo:'脾胃虚寒者少食', solarTerms:['夏至','小暑','大暑'] },
  { id:'hf006', name:'玫瑰花茶', source:'《本草纲目》', constitution:'血瘀', wuxing:'木', herbs:[{name:'干玫瑰花',dose:'6朵'},{name:'山楂',dose:'5g'}], ingredients:['蜂蜜适量'], method:'沸水冲泡，闷5分钟', efficacy:'疏肝活血、理气解郁', taboo:'孕妇、月经量多者不宜', solarTerms:['立春','雨水','春分'] },
  { id:'hf007', name:'玫瑰佛手茶', source:'《本草纲目》化裁', constitution:'气郁', wuxing:'木', herbs:[{name:'玫瑰花',dose:'6朵'},{name:'佛手',dose:'3g'},{name:'陈皮',dose:'3g'}], ingredients:['蜂蜜适量'], method:'沸水冲泡闷饮', efficacy:'疏肝理气、解郁安神', taboo:'阴虚火旺者少饮', solarTerms:['立春','春分','清明'] },
  { id:'hf008', name:'玉屏风汤', source:'《丹溪心法》', constitution:'特禀', wuxing:'金', herbs:[{name:'黄芪',dose:'30g'},{name:'防风',dose:'10g'},{name:'白术',dose:'15g'}], ingredients:['红枣5枚'], method:'药材煎煮30分钟，取汁饮用', efficacy:'益气固表、增强免疫', taboo:'阴虚火旺者不宜', solarTerms:['四季皆宜'] }
];

// ============ 节气艾灸方案 ============
const SOLAR_TERM_MOXA = [
  { term:'立春', points:['太冲','期门','肝俞'], focus:'疏肝理气，助阳气升发' },
  { term:'春分', points:['太冲','阳陵泉'], focus:'平肝潜阳，阴阳调和' },
  { term:'清明', points:['阴陵泉','足三里'], focus:'健脾化湿' },
  { term:'立夏', points:['神门','内关','心俞'], focus:'养心安神' },
  { term:'夏至', points:['命门','关元'], focus:'冬病夏治，培补阳气' },
  { term:'大暑', points:['丰隆','阴陵泉'], focus:'清热化湿' },
  { term:'立秋', points:['肺俞','尺泽','太渊'], focus:'润肺养阴' },
  { term:'秋分', points:['太溪','三阴交'], focus:'滋阴润燥' },
  { term:'立冬', points:['肾俞','命门','太溪'], focus:'补肾藏精' },
  { term:'冬至', points:['神阙','关元'], focus:'培元固本，冬至灸' },
  { term:'小寒', points:['命门','大椎','关元'], focus:'温阳散寒' }
];

// ============ 风水命卦数据 ============
const FENGSHUI = {
  eastLife: ['坎','离','震','巽'],
  westLife: ['乾','兑','艮','坤'],
  guaData: {
    '坎': { life:'东四命', luckyDir:['东南','南','东'], bedroom:'东/东南', desk:'面东/面南' },
    '离': { life:'东四命', luckyDir:['东','东南','南'], bedroom:'南/东南', desk:'面南' },
    '震': { life:'东四命', luckyDir:['南','东','东南'], bedroom:'东/南', desk:'面东' },
    '巽': { life:'东四命', luckyDir:['北','东','南'], bedroom:'东南/东', desk:'面东南' },
    '乾': { life:'西四命', luckyDir:['西','西北','西南'], bedroom:'西北/西', desk:'面西北' },
    '兑': { life:'西四命', luckyDir:['西北','西','西南'], bedroom:'西/西北', desk:'面西' },
    '艮': { life:'西四命', luckyDir:['西','东北','西南'], bedroom:'东北/西', desk:'面东北' },
    '坤': { life:'西四命', luckyDir:['西南','西','西北'], bedroom:'西南/西', desk:'面西南' }
  }
};

// ============ 产品库 ============
const PRODUCTS = [
  { id:'p001', name:'蕲艾条 5:1 陈年', category:'艾灸制品', wuxing:'火', constitution:null, price:68, desc:'五年陈蕲艾，1.8cm×20cm，10支装，适合日常温和灸', tag:'P0核心', image:'🪔' },
  { id:'p002', name:'蕲艾条 8:1 精品', category:'艾灸制品', wuxing:'火', constitution:null, price:128, desc:'八年陈极品蕲艾，火力温和渗透，适合温阳补虚', tag:'P0核心', image:'🪔' },
  { id:'p003', name:'蕲艾随身灸贴', category:'艾灸制品', wuxing:'火', constitution:null, price:39, desc:'便携艾灸贴，随时随地贴敷，10贴装', tag:'P0核心', image:'💉' },
  { id:'p004', name:'蕲艾五官灸套装', category:'中医调养', wuxing:'火', constitution:null, price:298, desc:'耳鼻眼喉口五款专用艾灸套装，蕲艾五官灸IP产品', tag:'★IP', image:'👁️' },
  { id:'p005', name:'节气艾灸礼盒·冬至款', category:'中医调养', wuxing:'火', constitution:null, price:168, desc:'冬至专用艾灸礼盒，含蕲艾条+灸盒+穴位图', tag:'P1', image:'🎁' },
  { id:'p019', name:'蕲艾精油温灸贴', category:'中医调养', wuxing:'火', constitution:null, price:89, desc:'蕲艾精油+温灸贴，面部五官专用的温和灸法', tag:'★IP', image:'🌿' },
  { id:'p020', name:'体质辨证调理套餐', category:'中医调养', wuxing:null, constitution:null, price:598, desc:'含体质评估+1个月艾灸方案+药食同源茶包', tag:'P1', image:'📋' },
  { id:'p006', name:'气虚体质养生茶包', category:'本草食材', wuxing:'土', constitution:'气虚', price:59, desc:'黄芪党参山药茶包，30包/盒，补气健脾', tag:'P0核心', image:'🍵' },
  { id:'p007', name:'阳虚体质温阳茶包', category:'本草食材', wuxing:'火', constitution:'阳虚', price:59, desc:'生姜桂圆桂圆茶包，温阳驱寒', tag:'P0核心', image:'🍵' },
  { id:'p008', name:'阴虚体质滋阴茶包', category:'本草食材', wuxing:'水', constitution:'阴虚', price:59, desc:'百合银耳枸杞茶包，滋阴润燥', tag:'P0核心', image:'🍵' },
  { id:'p009', name:'气郁体质疏肝茶包', category:'本草食材', wuxing:'木', constitution:'气郁', price:59, desc:'玫瑰花佛手陈皮茶包，疏肝解郁', tag:'P0核心', image:'🍵' },
  { id:'p010', name:'五行木运手串', category:'穿戴饰品', wuxing:'木', constitution:null, price:88, desc:'绿檀木手串，喜木者幸运配饰', tag:'P0', image:'📿' },
  { id:'p011', name:'五行火运手串', category:'穿戴饰品', wuxing:'火', constitution:null, price:88, desc:'红玛瑙手串，喜火者幸运配饰', tag:'P0', image:'📿' },
  { id:'p012', name:'五行土运手串', category:'穿戴饰品', wuxing:'土', constitution:null, price:88, desc:'黄水晶手串，喜土者幸运配饰', tag:'P0', image:'📿' },
  { id:'p013', name:'五行金运手串', category:'穿戴饰品', wuxing:'金', constitution:null, price:88, desc:'白水晶手串，喜金者幸运配饰', tag:'P0', image:'📿' },
  { id:'p014', name:'五行水运手串', category:'穿戴饰品', wuxing:'水', constitution:null, price:88, desc:'黑曜石手串，喜水者幸运配饰', tag:'P0', image:'📿' },
  { id:'p015', name:'铜质艾灸盒', category:'艾灸器具', wuxing:null, constitution:null, price:45, desc:'随身铜灸盒，配合艾条使用，控温方便', tag:'P1', image:'🔧' },
  { id:'p016', name:'文昌塔摆件', category:'风水摆件', wuxing:null, constitution:null, price:158, desc:'九层铜文昌塔，助事业学业', tag:'P1', image:'🏛️' },
  { id:'p017', name:'招财貔貅摆件', category:'风水摆件', wuxing:null, constitution:null, price:198, desc:'黄铜貔貅，招财化煞', tag:'P1', image:'🦁' },
  { id:'p018', name:'二十四节气养生粥料礼盒', category:'本草食材', wuxing:null, constitution:null, price:268, desc:'24节气应季粥料套装，全年养生', tag:'P1', image:'🎁' }
];

// 导出（挂载到全局）
window.XJG_DATA = {
  HEAVENLY_STEMS, EARTHLY_BRANCHES, WUXING_OF_STEM, WUXING_OF_BRANCH,
  YINYANG_OF_STEM, ZODIAC_OF_BRANCH, WUXING_DATA,
  CONSTELLATIONS, BLOOD_TYPES, CONSTITUTIONS,
  HERB_FORMULAS, SOLAR_TERM_MOXA,
  FENGSHUI, PRODUCTS
};

// ============================================================
// 二、命理核心数据（来自 data/mingli.js）
// ============================================================

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

// 导出
Object.assign(window.XJG_DATA, {
  TEN_GODS, NAYIN_TABLE, SHENSHA, TAOhUA_MAP
});
window.XJG_ENGINE_NAYIN_WX = nayinWuxing;
window.XJG_ENGINE_CALCDAYUN = calcDaYun;

// ============================================================
// 三、扩充数据（来自 data/extra.js）
// ============================================================

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
  { id:'hf024', name:'核桃杜仲汤', source:'民间食疗', constitution:'阳虚', wuxing:'水', herbs:[{name:'核桃',dose:'30g'},{name:'杜仲',dose:'15g'}], ingredients:['猪腰1对','盐适量'], method:'猪腰处理干净与药材同炖1小时', efficacy:'补肾壮腰、温阳固精', taboo:'阴虚火旺者不宜', solarTerms:['冬至','��寒'] }
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

// ============================================================
// 四、分析引擎主代码（来自 js/engine.js）
// ============================================================

/* === js/engine.js === */
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
