/**
 * 玄机阁 · 综合提运平台 - 核心数据底座
 * 包含：典籍库、八字规则、体质/血型/星座规则、艾灸方案、药食同源方剂、产品库
 */

// ============ 一、天干地支基础数据 ============
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

// ============ 二、五行对应数据 ============
const WUXING_DATA = {
  '木': { color: ['青','绿'], season: '春', direction: '东', organ: '肝胆', emotion: '怒', flavor: '酸', foods: ['菠菜','芹菜','枸杞','菊花','玫瑰花'] },
  '火': { color: ['红','紫'], season: '夏', direction: '南', organ: '心小肠', emotion: '喜', flavor: '苦', foods: ['红枣','桂圆','莲子','苦瓜'] },
  '土': { color: ['黄','棕'], season: '长夏', direction: '中', organ: '脾胃', emotion: '思', flavor: '甘', foods: ['山药','小米','南瓜','大枣','茯苓'] },
  '金': { color: ['白','银','金'], season: '秋', direction: '西', organ: '肺大肠', emotion: '悲', flavor: '辛', foods: ['百合','银耳','白果','雪梨'] },
  '水': { color: ['黑','蓝'], season: '冬', direction: '北', organ: '肾膀胱', emotion: '恐', flavor: '咸', foods: ['黑芝麻','黑豆','桑葚','核桃'] }
};

// ============ 三、星座数据 ============
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

// ============ 四、血型数据 ============
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

// ============ 五、中医九种体质 ============
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

// ============ 六、周易六十四卦（样例收录核心16卦）============
const HEXAGRAMS = [
  { num:1, name:'乾', chinese:'乾为天', symbol:'☰☰', wuxing:'金', judge:'元亨利贞。', meaning:'刚健中正，自强不息。', image:'天行健，君子以自强不息。', fortune:'大吉。事业有成，宜积极进取。' },
  { num:2, name:'坤', chinese:'坤为地', symbol:'☷☷', wuxing:'土', judge:'元亨，利牝马之贞。', meaning:'厚德载物，柔顺包容。', image:'地势坤，君子以厚德载物。', fortune:'吉。宜守成包容，顺势而为。' },
  { num:3, name:'屯', chinese:'水雷屯', symbol:'☵☳', wuxing:'水', judge:'元亨利贞，勿用有攸往，利建侯。', meaning:'初创艰难，需耐心蓄力。', image:'云雷屯，君子以经纶。', fortune:'平。起步维艰，坚持则有成。' },
  { num:4, name:'蒙', chinese:'山水蒙', symbol:'☶☵', wuxing:'土', judge:'亨。匪我求童蒙，童蒙求我。', meaning:'蒙昧待启，需虚心学习。', image:'山下出泉，蒙；君子以果行育德。', fortune:'平。宜学习求教，启智开蒙。' },
  { num:7, name:'师', chinese:'地水师', symbol:'☷☵', wuxing:'水', judge:'贞，丈人吉无咎。', meaning:'统兵之道，纪律严明。', image:'地中有水，师；君子以容民畜众。', fortune:'吉。宜有组织有计划地行动。' },
  { num:11, name:'泰', chinese:'地天泰', symbol:'☷☰', wuxing:'土', judge:'小往大来，吉亨。', meaning:'天地交泰，通达安泰。', image:'天地交，泰；后以财成天地之道。', fortune:'大吉。万事顺遂，宜把握机遇。' },
  { num:12, name:'否', chinese:'天地否', symbol:'☰☷', wuxing:'金', judge:'否之匪人，不利君子贞。', meaning:'天地不交，闭塞不通。', image:'天地不交，否；君子以俭德辟难。', fortune:'凶。宜守不宜进，韬光养晦。' },
  { num:13, name:'同人', chinese:'天火同人', symbol:'☰☲', wuxing:'金', judge:'同人于野，亨。', meaning:'与人和同，协力共进。', image:'天与火，同人；君子以类族辨物。', fortune:'吉。宜合作共赢，广结善缘。' },
  { num:14, name:'大有', chinese:'火天大有', symbol:'☲☰', wuxing:'火', judge:'元亨。', meaning:'大有收获，盛德富有。', image:'火在天上，大有；君子以遏恶扬善。', fortune:'大吉。丰收之象，宜善用财富。' },
  { num:15, name:'谦', chinese:'地山谦', symbol:'☷☶', wuxing:'土', judge:'亨，君子有终。', meaning:'谦逊低调，终有善果。', image:'地中有山，谦；君子以裒多益寡。', fortune:'吉。谦受益，低调行事得福。' },
  { num:24, name:'复', chinese:'地雷复', symbol:'☷☳', wuxing:'土', judge:'亨。出入无疾，朋来无咎。', meaning:'一阳来复，转机初现。', image:'雷在地中，复；先王以至日闭关。', fortune:'吉。否极泰来，转机将至。' },
  { num:42, name:'益', chinese:'风雷益', symbol:'☴☳', wuxing:'木', judge:'利有攸往，利涉大川。', meaning:'损上益下，有所增益。', image:'风雷，益；君子以见善则迁，有过则改。', fortune:'大吉。宜进取作为，受益匪浅。' },
  { num:55, name:'丰', chinese:'雷火丰', symbol:'☳☲', wuxing:'木', judge:'亨，王假之，勿忧，宜日中。', meaning:'丰盛至极，盛极必衰。', image:'雷电皆至，丰；君子以折狱致刑。', fortune:'吉。盛运当头，宜居安思危。' },
  { num:63, name:'既济', chinese:'水火既济', symbol:'☵☲', wuxing:'水', judge:'亨小，利贞，初吉终乱。', meaning:'事已成功，需防患未然。', image:'水在火上，既济；君子以思患而预防之。', fortune:'平吉。已成之事，须谨慎守成。' },
  { num:64, name:'未济', chinese:'火水未济', symbol:'☲☵', wuxing:'火', judge:'亨，小狐汔济，濡其尾，无攸利。', meaning:'事未完成，蓄势待发。', image:'火在水上，未济；君子以慎辨物居方。', fortune:'平。万事待成，坚持则有结果。' },
  { num:5, name:'需', chinese:'水天需', symbol:'☵☰', wuxing:'水', judge:'有孚，光亨，贞吉。利涉大川。', meaning:'等待时机，蓄势而动。', image:'云上于天，需；君子以饮食宴乐。', fortune:'平吉。宜耐心等待，时机将至。' }
];

// ============ 七、药食同源方剂库 ============
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

// ============ 八、节气艾灸方案 ============
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

// ============ 九、蕲艾五官灸方案 ============
const WUGUAN_MOXA = [
  { organ:'耳', visceras:'肾/胆', points:['耳门','听宫','翳风'], scene:'耳鸣、听力保养' },
  { organ:'鼻', visceras:'肺', points:['迎香','印堂','肺俞'], scene:'鼻炎、鼻窍通利' },
  { organ:'眼', visceras:'肝', points:['睛明','太阳','肝俞'], scene:'视疲劳、眼干涩' },
  { organ:'喉', visceras:'肺/肾', points:['廉泉','天突','列缺'], scene:'咽喉不适、声音保养' },
  { organ:'口', visceras:'脾/心', points:['地仓','颊车','足三里'], scene:'口腔溃疡、健脾' }
];

// ============ 十、风水命卦数据 ============
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

// ============ 十一、典籍库 ============
const CLASSICS_LIBRARY = [
  { id:'c001', title:'周易', system:'易学占卜', dynasty:'先秦', author:'佚名（周文王/周公）', category:'经部', priority:'P0', desc:'群经之首，六十四卦推演天地万物之理' },
  { id:'c002', title:'易传（十翼）', system:'易学占卜', dynasty:'先秦', author:'孔子及后学', category:'经部', priority:'P0', desc:'解释周易的十篇文献，含彖、象、系辞等' },
  { id:'c003', title:'渊海子平', system:'中式命理', dynasty:'宋', author:'徐子平', category:'子部', priority:'P0', desc:'八字命理奠基之作，四柱推命经典' },
  { id:'c004', title:'三命通会', system:'中式命理', dynasty:'明', author:'万民英', category:'子部', priority:'P0', desc:'命理集大成之作，十二卷详论' },
  { id:'c005', title:'滴天髓', system:'中式命理', dynasty:'明', author:'京图/刘伯温注', category:'子部', priority:'P0', desc:'命理高阶经典，论五行生克制化' },
  { id:'c006', title:'子平真诠', system:'中式命理', dynasty:'清', author:'沈孝瞻', category:'子部', priority:'P0', desc:'论格局之鼻祖，八字入门必读' },
  { id:'c007', title:'五行大义', system:'中式命理', dynasty:'隋', author:'萧吉', category:'子部', priority:'P0', desc:'五行学说集大成，论五行生克关系' },
  { id:'c008', title:'黄帝内经·素问', system:'中医本草', dynasty:'先秦', author:'佚名', category:'医部', priority:'P0', desc:'中医理论奠基，含运气七篇、五味入五脏' },
  { id:'c009', title:'本草纲目', system:'中医本草', dynasty:'明', author:'李时珍', category:'医部', priority:'P0', desc:'中药学巨著，记载药材1892种，"艾以蕲州者为胜"' },
  { id:'c010', title:'神农本草经', system:'中医本草', dynasty:'汉', author:'佚名', category:'医部', priority:'P0', desc:'现存最早本草专著，分上中下三品' },
  { id:'c011', title:'针灸大成', system:'中医本草', dynasty:'明', author:'杨继洲', category:'医部', priority:'P0', desc:'针灸学集大成，论经络穴位与灸法' },
  { id:'c012', title:'针灸甲乙经', system:'中医本草', dynasty:'晋', author:'皇甫谧', category:'医部', priority:'P0', desc:'现存最早针灸学专著' },
  { id:'c013', title:'中医体质分类与判定', system:'体质生理', dynasty:'现代', author:'王琦', category:'医部', priority:'P0', desc:'中医九种体质判定标准' },
  { id:'c014', title:'八宅明镜', system:'环境风水', dynasty:'唐', author:'杨筠松', category:'子部', priority:'P0', desc:'八宅风水经典，论东四命西四命' },
  { id:'c015', title:'紫微斗数全书', system:'中式命理', dynasty:'明', author:'陈抟一脉', category:'子部', priority:'P1', desc:'紫微斗数经典，星曜入十二宫推命' },
  { id:'c016', title:'梅花易数', system:'易学占卜', dynasty:'宋', author:'邵雍', category:'子部', priority:'P1', desc:'以数起卦，体用生克断事' },
  { id:'c017', title:'遵生八笺', system:'营养食疗', dynasty:'明', author:'高濂', category:'子部', priority:'P1', desc:'养生学专著，论二十四节气起居饮食' },
  { id:'c018', title:'扁鹊心书', system:'中医本草', dynasty:'宋', author:'窦材', category:'医部', priority:'P1', desc:'重灸派经典，论节气艾灸与保健灸法' },
  { id:'c019', title:'推背图', system:'典籍预言', dynasty:'唐', author:'李淳风/袁天罡', category:'子部', priority:'P1', desc:'六十象预言图谶，中国预言学代表作' },
  { id:'c020', title:'四书', system:'西方占星', dynasty:'2世纪', author:'托勒密', category:'西学', priority:'P0', desc:'西方占星术奠基之作，论行星与星座' }
];

// ============ 十二、产品库 ============
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
  HEXAGRAMS, HERB_FORMULAS, SOLAR_TERM_MOXA, WUGUAN_MOXA,
  FENGSHUI, CLASSICS_LIBRARY, PRODUCTS
};
