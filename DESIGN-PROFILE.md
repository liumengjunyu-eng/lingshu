# LingShu · Life Compass — 项目设计档案

> **本文件是项目的唯一设计真相源（Single Source of Truth）。**
> 后期任何设计工程师、AI Agent、外部协作者，在动手改任何东西之前，先读这份档案。

---

## 一、品牌人格

### 1.1 品牌身份

| 项目 | 内容 |
|------|------|
| **品牌全称** | LingShu · Life Compass |
| **中文项目名** | 灵枢（仅内部使用，海外版不出现中文） |
| **Slogan** | "Your body is your best feng shui." |
| **定位语** | "An AI-powered wellness guide, rooted in 5,000 years of Eastern wisdom." |
| **一句话说明** | Discover your unique energy blueprint. AI birth chart analysis + 5-dimension wellness plan for body, mind, and life. |

### 1.2 品牌人格（文案基调）

**参考人格：Co-Star 式"冷酷真相" + 高端冥想 App 的克制感**

不说算命腔，用冷静、直接、有智慧感的语言：

| ❌ 不要用 | ✅ 替换为 |
|----------|---------|
| You will be lucky this year | Your energy pattern shows you're ready for growth |
| You will meet someone important | Your chart indicates strong collaboration energy this month |
| Fortune telling | Self-discovery & wellness guidance |
| Prediction | Insights / Guidance |
| Five Elements (干巴巴) | Your Inner Energy Team |
| You lack Wood | You need more growth energy |
| Metal overcomes Wood | Too much structure blocks your creativity |
| BaZi astrology | Ancient Eastern birth chart analysis |
| 算命 | Life Compass |
| 风水 | Energy flow / Space harmony |
| 调理 | Wellness plan / Rebalancing |

### 1.3 参考品牌对标

| 对标品牌 | 借鉴点 | 不学什么 |
|---------|--------|---------|
| **Co-Star** | 极简暗黑UI、冷酷真相文案、社交分享 | 不学它的纯占星定位 |
| **hint.app** | 极简单页转化、强付费墙、病毒传播 | 不学它的过度激怒用户 |
| **FateTell** | 专业八字深度、典籍引用信任背书、$9.99定价 | 不学它的纯八字（我们加中医调理） |
| **Karma and Luck** | 高溢价实物产品、情感叙事、公益捐赠 | MVP阶段不做实物 |

---

## 二、视觉设计系统

### 2.1 颜色方案（严格执行，不许杂色）

```
背景层：
  --bg:          #0D0D1A   (深邃星空黑 — 全站背景)
  --bg-soft:     #1A1A2E   (深墨蓝 — 卡片/区块)
  --bg-card:     #161628   (次级卡片)
  --bg-input:    #121220   (输入框)

主色层：
  --gold:        #C9A96E   (古朴金 — 标题、主按钮、关键强调)
  --gold-light:  #D4BC8A   (浅金 — hover)
  --gold-dark:   #A88B52   (深金 — pressed)
  --copper:      #D4A574   (暖铜 — 次要按钮、hover)

文字层：
  --text:        #E8E4DE   (正文 — 暖米白)
  --text-2:      #B0AAA0   (次要文字)
  --text-3:      #8A8580   (说明文字、免责声明)
  --text-4:      #555550   (占位符、最弱)

五行色（深色主题适配版）：
  --wood:   #7DBF7D
  --fire:   #E89090
  --earth:  #D4B896
  --metal:  #C8C8C8
  --water:  #7DA8C0

边框/分割：
  --border:        #2A2A40
  --border-light:  #1F1F35
  --divider:       #1A1A2E
```

**金色使用原则**：金色是"点睛"，不是"铺满"。只用于标题、主按钮、关键数据、强调元素。正文一律用米白。

### 2.2 字体

| 用途 | 字体 | 备用 |
|------|------|------|
| 标题（H1-H5） | `Playfair Display` | Georgia, serif |
| 正文 | `Inter` | system-ui, -apple-system, sans-serif |

Google Fonts 引入：
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

字号分级：
| 级别 | 字号 | 用途 |
|------|------|------|
| H1 | clamp(2rem, 6vw, 3.5rem) | Hero 主标题 |
| H2 | 1.6rem | 区块标题 |
| H3 | 1.15rem | 卡片标题 |
| H4 | 0.95rem | 子标题 |
| Body | 16px | 正文（移动端不可小于16px，防iOS缩放） |
| Small | 0.82rem | 说明文字 |
| Caption | 0.72rem | 免责声明、出处 |

### 2.3 Logo

**设计方向**：极简抽象符号 — 人体经络线条 + 罗盘指针的融合

- **不要**：八卦图、太极图、星星月亮堆砌、任何文字在Logo图形内
- **要**：金色线条勾勒人体站姿轮廓，胸前有圆形罗盘指针元素
- **风格参考**：高端冥想App（Calm、Headspace）的Logo质感
- **当前实现**：SVG 格式，位于 `lingShu.html` 的 Hero 区域

```svg
<!-- 当前 Logo SVG -->
<svg viewBox="0 0 64 64">
  <!-- 人体轮廓 -->
  <circle cx="32" cy="14" r="5" stroke="#C9A96E" stroke-width="1.5" fill="none"/>
  <line x1="32" y1="19" x2="32" y2="42" stroke="#C9A96E" stroke-width="1.5"/>
  <line x1="22" y1="28" x2="42" y2="28" stroke="#C9A96E" stroke-width="1.5"/>
  <line x1="32" y1="42" x2="26" y2="56" stroke="#C9A96E" stroke-width="1.5"/>
  <line x1="32" y1="42" x2="38" y2="56" stroke="#C9A96E" stroke-width="1.5"/>
  <!-- 罗盘指针 -->
  <circle cx="32" cy="28" r="7" stroke="#C9A96E" stroke-width="1" fill="none" opacity=".4"/>
  <path d="M32 22 L34 28 L32 34 L30 28 Z" fill="#C9A96E" opacity=".8"/>
</svg>
```

### 2.4 间距系统

```
--sp-xs:  0.5rem  (8px)
--sp-sm:  1rem    (16px)
--sp-md:  1.5rem  (24px)
--sp-lg:  2.5rem  (40px)
--sp-xl:  4rem    (64px)
--sp-2xl: 6rem    (96px)
```

### 2.5 圆角

```
--r-sm:   8px    (输入框、小标签)
--r-md:   14px   (卡片、按钮)
--r-lg:   20px   (大卡片)
--r-xl:   32px   (特殊区域)
--r-full: 999px  (药丸形按钮)
```

### 2.6 阴影

```
--shadow-sm:     0 1px 3px rgba(0,0,0,.3)
--shadow-md:     0 4px 20px rgba(0,0,0,.35)
--shadow-lg:     0 8px 40px rgba(0,0,0,.4)
--shadow-gold:   0 4px 20px rgba(201,169,110,.2)   (金色元素专用)
```

### 2.7 移动端断点

| 断点 | 宽度 | 变化 |
|------|------|------|
| Tablet | max-width: 768px | 表单单列、Hero缩小、卡片padding减小 |
| Phone | max-width: 480px | 进一步缩小、网格变单列 |

**移动端硬性要求**：
- 所有按钮 `min-height: 48px`（大按钮 52px）
- 所有输入框 `font-size: 16px`（防 iOS 自动缩放）
- 表单在 768px 以下变为单列

---

## 三、项目文件结构

### 3.1 海外版（当前主版本）

```
/workspace/xuanjige/
├── lingShu.html              # ★ 海外版主页面（前端全部内容：HTML+CSS+JS）
├── index.html                # 同 lingShu.html（Vercel 根URL入口）
├── intl-engine.js            # ★ 八字排盘引擎（本地JS计算，零API成本）
├── api/
│   ├── create-checkout-session.js   # Stripe Checkout Session 创建
│   ├── webhook.js                   # Stripe 支付回调
│   └── generate-report.js           # 报告生成 API（本地引擎 + Deepseek增强）
├── package.json              # 依赖：stripe
├── vercel.json               # Vercel 部署配置
├── .gitignore
├── README.md                 # 部署说明
│
│   ── 以下为中文版备份文件，海外版不使用 ──
├── international.html        # 海外版备份（同 lingShu.html）
├── cn-index-backup.html      # 中文版备份
├── css/style.css             # 中文版样式
├── js/app.js                 # 中文版应用逻辑
├── js/engine.js              # 中文版引擎
└── data/                     # 中文版数据文件
    ├── data.js
    ├── hexagrams.js
    ├── mingli.js
    ├── tuibeitu.js
    ├── extra.js
    ├── quiz_herbs.js
    └── ziwei.js
```

### 3.2 Skill 文件映射

| Skill 名称 | 文件路径 | 用途 | 对应版本 |
|------------|---------|------|---------|
| `xuanjige-dev` | `/root/.codebuddy/skills/xuanjige-dev/SKILL.md` | 中文版开发助手 | 国内版（玄机阁/灵枢） |
| `ui-review` | `/root/.codebuddy/skills/ui-review/SKILL.md` | UI设计审查（五维度） | 通用 |
| `fe-debug` | `/root/.codebuddy/skills/fe-debug/SKILL.md` | 前端调试助手 | 通用 |
| `preview` | `/root/.codebuddy/skills/preview/SKILL.md` | 预览部署 | 通用 |

**注意**：当前没有海外版专属 skill。建议后续创建 `lingshu-dev` skill。

---

## 四、首页结构（5区块极简单页）

```
┌─────────────────────────────────┐
│  Block 1: Hero（全屏首屏）       │
│  ┌─ Logo（小）                  │
│  ├─ H1: "Your body is your      │
│  │      best feng shui."        │
│  ├─ 副标题                      │
│  ├─ [Discover Your Energy       │
│  │   Blueprint →] (金色按钮)    │
│  └─ "Powered by AI + 5,000      │
│      Years of Eastern Wisdom"   │
├─────────────────────────────────┤
│  Block 2: 输入区                │
│  ┌─ Full Name                   │
│  ├─ Date of Birth (日期选择器)  │
│  ├─ Time of Birth (时间选择器)  │
│  ├─ Place of Birth (文本输入)   │
│  ├─ Gender / Blood Type         │
│  ├─ Body Constitution (下拉)    │
│  └─ [Generate My Free Report →] │
├─────────────────────────────────┤
│  Block 3: 报告预览 Demo         │
│  ┌─ Canvas 五行雷达图           │
│  ├─ 3个指标 (Day Master/Color/  │
│  │   Lucky Number)              │
│  ├─ 典籍引用块                  │
│  └─ 模糊付费预览 + "Unlock $9.99"│
├─────────────────────────────────┤
│  Block 4: 社会证明              │
│  ┌─ "10,000+ people have found  │
│  │   their balance"             │
│  └─ 3条用户好评                 │
├─────────────────────────────────┤
│  Block 5: Footer                │
│  ┌─ Instagram / TikTok 图标     │
│  ├─ 免责声明                    │
│  ├─ "Powered by AI + Ancient    │
│  │   Eastern Wisdom"            │
│  └─ © 2025 LingShu              │
└─────────────────────────────────┘
```

**首页铁律**：零导航菜单、零多余功能入口。用户路径只有一条：输入信息 → 生成报告。

---

## 五、报告页面结构

### 5.1 免费报告（用户输入后直接获得）

| 板块 | 内容 |
|------|------|
| ① Your Energy Blueprint | Canvas 五行雷达图 + 五行条形图 + 强弱/喜用 |
| ② Your Inner Energy Team | 2-3句五行综述（Co-Star式冷酷真相文案） |
| ③ Today's Energy Tips | 幸运色 + 幸运数字 + 宜/忌 |
| ④ Share Your Energy Avatar | 迷你雷达图 + 3关键词 + 下载/分享按钮 |
| ⑤ 付费墙 | "You're only seeing 20%..." + 3卖点 + $9.99 |
| ⑥ 模糊预览 | 付费内容模糊展示（blur效果） |

### 5.2 付费报告（$9.99 解锁后）

| 板块 | 内容 | 典籍出处 |
|------|------|---------|
| ④ Complete Birth Chart | 四柱排盘 + 日主/生肖/体质/喜用 | Sanming Tonghui |
| ⑤ Career & Life Path | 十神分析 + 职业倾向 | Yuanhai Ziping |
| ⑥ 5-Dimension Wellness Plan | 运动饮食身体心理环境 | 见下表 |
| ⑦ Biorhythm & Meridian Clock | 生物钟三维度 + 子午流注 | Ling Shu |
| ⑧ Daily Action Plan | 6条可执行清单 | 综合典籍 |
| ⑨ Subscription Upsell | $9.99/月 + $79.99/年 | — |
| ⑩ Trust Badge | "Every insight is referenced to classical texts." | — |

### 5.3 五大维度调理方案典籍映射

| 维度 | 图标 | 典籍出处 |
|------|------|---------|
| Movement | 🏃 | Huangdi Neijing, Ch.2 (Four Seasons) |
| Nutrition | 🥗 | Bencao Gangmu (Compendium of Materia Medica) |
| Body | 🔥 | Zhenjiu Dacheng (Great Compendium of Acupuncture) |
| Mind | 🧘 | Huangdi Neijing |
| Environment | 🏠 | BaZhai Mingjing (Bright Mirror of Eight Mansions) |

---

## 六、付费体系

| 产品 | 价格 | 说明 |
|------|------|------|
| 免费报告 | $0 | 五行雷达图 + 综述 + 幸运色/数字 |
| 单次完整报告 | $9.99 | 一次性解锁全部内容 |
| 月订阅 | $9.99/月 | 每日能量更新 + 月度调理计划刷新 |
| 年订阅 | $79.99/年 | 包含月订阅全部内容，省33% |

**支付流程**：
1. 用户点击定价卡 → `fetch('/api/create-checkout-session')`
2. 后端创建 Stripe Checkout Session → 返回 `session.url`
3. 前端 `window.location.href = data.url` 跳转 Stripe 支付页
4. 支付成功 → Stripe 重定向回 `/?paid=true&order=xxx`
5. 前端检测 `paid=true` → 解锁报告 + 显示成功提示

**沙箱环境 fallback**：如果 `/api/create-checkout-session` 不可用（如本地开发），自动降级为 mock 支付。

---

## 七、技术架构

### 7.1 前端

| 项目 | 选择 |
|------|------|
| 框架 | 无框架，纯 HTML/CSS/JS |
| 主文件 | `lingShu.html`（HTML + CSS + JS 全部内联） |
| 引擎 | `intl-engine.js`（外部引用，八字排盘本地计算） |
| 部署 | Vercel（静态文件 + Serverless Functions） |

### 7.2 排盘引擎

- **八字排盘**：纯本地 JS 计算，不调任何 API（零成本）
- **文件**：`intl-engine.js`（从中文版 `engine.js` 提取）
- **验证基准**：1990-06-15 10:00 → 庚午年 壬午月 辛亥日 癸巳时
- **核心函数**：`calcBaZi()` / `analyzeWuxing()` / `calcTenGods()` / `calcDaYunFull()` / `calcLiuNian()` / `calcShensha()` / `getConstellation()` / `calcBiorhythm()` / `calcMingGua()`

### 7.3 AI 增强（可选）

| 场景 | 模型 | 成本 |
|------|------|------|
| 日常报告 | Deepseek-V4-Flash | 0.06x（极便宜） |
| 深度报告 | Deepseek-V4-Pro | 0.16x |
| 提示词缓存 | 固定系统提示词 | 费用减半 |

**系统提示词**：
```
You are an expert in Traditional Chinese Medicine and Five Elements (Wu Xing)
philosophy, with deep knowledge of Huangdi Neijing and I Ching.

Given the user's birth chart, analyze their Five Elements balance and generate
a 5-dimension wellness plan. Always cite classical sources. Use a "cool, direct,
non-sugarcoated" tone — like a wise but honest friend.
```

### 7.4 支付

| 项目 | 选择 |
|------|------|
| 支付网关 | Stripe |
| 模式 | Checkout Session（重定向到 Stripe 托管页面） |
| Webhook | `checkout.session.completed` |
| 环境变量 | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` |

### 7.5 后端 API

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/create-checkout-session` | POST | 创建 Stripe Checkout Session |
| `/api/webhook` | POST | Stripe 支付回调 |
| `/api/generate-report` | POST | 报告生成（本地引擎 + Deepseek增强） |

---

## 八、社交病毒传播

### Share Your Energy Avatar

| 项目 | 说明 |
|------|------|
| 位置 | 免费报告底部（付费墙**之前**，先分享再付费） |
| 卡片内容 | 用户名 + 迷你五行雷达图 + 3个特质关键词 + 品牌水印 |
| 下载 | `downloadAvatar()` — Canvas 合成 400×520 PNG |
| 分享 | `shareAvatar('instagram')` / `shareAvatar('tiktok')` — Web Share API |
| 复制 | `copyShareLink()` — 剪贴板复制分享文案 |
| 预填文案 | "Just discovered my Energy Blueprint! 🔮 What's yours? Find out at LingShu.Life" |

### 特质关键词生成规则

| 来源 | 关键词池 |
|------|---------|
| 最强五行 | Wood→Creative, Fire→Passionate, Earth→Grounded, Metal→Precise, Water→Intuitive |
| 日主天干 | 甲→Bold, 乙→Gentle, 丙→Radiant, 丁→Warm, 戊→Steady, 己→Nurturing, 庚→Sharp, 辛→Refined, 壬→Deep, 癸→Mysterious |
| 体质 | 平和→Balanced, 气虚→Thoughtful, 阳虚→Calm, 阴虚→Focused, 痰湿→Easygoing, 湿热→Dynamic, 血瘀→Resilient, 气郁→Sensitive, 特禀→Unique |

---

## 九、信任背书与合规

### 信任背书（全站固定两处）

| 位置 | 文案 |
|------|------|
| 首页 Hero 底部 | "Powered by AI + 5,000 Years of Eastern Wisdom" |
| 报告页底部 | "Every insight is referenced to classical texts. — Huangdi Neijing · I Ching" |

### 免责声明（全站底部固定）

> "For entertainment and self-discovery purposes only. This AI-generated report is not a substitute for professional medical, financial, or psychological advice. By using this service, you agree to our Terms of Service and Privacy Policy."

### 典籍引用格式

每个调理建议底部标注出处：
```
— Huangdi Neijing, Chapter 5
— Bencao Gangmu (Compendium of Materia Medica)
— Zhenjiu Dacheng (Great Compendium of Acupuncture)
```

---

## 十、部署清单

### 环境变量

| Key | 值 | 必需 |
|-----|-----|------|
| `STRIPE_SECRET_KEY` | `sk_test_xxx` / `sk_live_xxx` | ✅ |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | ✅ |
| `DEEPSEEK_API_KEY` | `sk-xxx` | ⚠️ 可选 |

### 部署步骤

1. `git push` 到 GitHub
2. Vercel 导入项目 → Framework: Other → Deploy
3. 配置环境变量 → Redeploy
4. Stripe Dashboard → Webhooks → 添加端点 `https://域名/api/webhook`
5. 绑定域名 `lingshu.life`（可选）

### 测试卡

```
卡号: 4242 4242 4242 4242
过期: 任意未来日期
CVC: 任意3位
```

---

## 十一、设计工程师交接清单

### 改任何东西之前，确认你理解了：

- [ ] 品牌名是 **LingShu · Life Compass**，不是"玄机阁"或"灵枢"
- [ ] 全站英文，不出现中文（引擎内部中文常量除外）
- [ ] 颜色只有深蓝黑 + 金 + 米白，没有蓝/红/绿等杂色
- [ ] 字体只有 Playfair Display + Inter
- [ ] 首页只有5个区块，零导航菜单
- [ ] 金色是"点睛"不是"铺满"
- [ ] 文案用 Co-Star 式"冷酷真相"人格，不用算命腔
- [ ] 每个调理建议都有典籍出处
- [ ] 付费墙在免费报告和付费报告之间
- [ ] Share Avatar 在付费墙**之前**（先分享再付费）
- [ ] 移动端按钮最小 48px，输入框字号 16px
- [ ] 排盘引擎是本地计算，不调 API
- [ ] Stripe 是真实接入（非 mock），但有 mock fallback

### 常见修改指南

| 需求 | 改哪里 |
|------|--------|
| 改颜色 | `lingShu.html` 顶部 `:root` CSS 变量 |
| 改文案 | `lingShu.html` 对应区块的 HTML/JS 字符串 |
| 改报告内容 | `lingShu.html` 中 `renderReport()` 和 `renderPaidReport()` 函数 |
| 改付费价格 | `lingShu.html` 中 `processPayment()` 的 `planInfo` + `api/create-checkout-session.js` 的 `PRICES` |
| 改典籍引用 | `lingShu.html` 中 `citations` 对象 |
| 改特质关键词 | `lingShu.html` 中 `generateTraits()` 函数 |
| 加新功能 | 先确认是否符合"5区块极简"原则，再加 |

---

## 十二、版本历史

| 版本 | 日期 | 改动 |
|------|------|------|
| v1.0 | 2025-06 | 海外版初版：英文UI、深色主题、5区块首页 |
| v2.0 | 2025-06 | Share Avatar、三档定价、后端API、Vercel部署配置 |

---

*本档案由 WorkBuddy 维护，最后更新：2025-06-23*
*如有疑问，请把这份档案完整发给你的设计工程师或 AI Agent。*
