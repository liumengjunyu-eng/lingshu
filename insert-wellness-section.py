#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
在 js/app.js 的 renderReport 函数中，在 section ② 和 ③ 之间插入六维调理方案
"""

with open(r'C:\Users\刘\Desktop\lingshu\js\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 要插入的新代码（在②之后、③之前）
new_section = '''
    // ③ 六维调理方案（核心建议）
    const plan = window.getWellnessPlan(r.wuxing.weakest);
    html += `<div class="card"><h3>③ 六维调理方案（核心建议）</h3>
      <div class="sub">您的五行<span style="color:var(--accent)">${r.wuxing.weakest}</span>偏弱，以下方案针对此进行调理</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.2rem 0;">
        <div style="text-align:center;background:var(--bg);border-radius:12px;padding:1.2rem .8rem;">
          <div style="font-size:2rem;margin-bottom:.5rem;">🎨</div>
          <div style="font-size:.82rem;color:var(--muted);margin-bottom:.3rem;">穿戴颜色</div>
          <div style="font-size:.88rem;color:var(--gold);">${plan.color}</div>
        </div>
        <div style="text-align:center;background:var(--bg);border-radius:12px;padding:1.2rem .8rem;">
          <div style="font-size:2rem;margin-bottom:.5rem;">🧭</div>
          <div style="font-size:.82rem;color:var(--muted);margin-bottom:.3rem;">有利方位</div>
          <div style="font-size:.88rem;color:var(--gold);">${plan.direction}</div>
        </div>
        <div style="text-align:center;background:var(--bg);border-radius:12px;padding:1.2rem .8rem;">
          <div style="font-size:2rem;margin-bottom:.5rem;">🥗</div>
          <div style="font-size:.82rem;color:var(--muted);margin-bottom:.3rem;">饮食调养</div>
          <div style="font-size:.88rem;color:var(--gold);">${plan.food}</div>
        </div>
        <div style="text-align:center;background:var(--bg);border-radius:12px;padding:1.2rem .8rem;">
          <div style="font-size:2rem;margin-bottom:.5rem;">🏃</div>
          <div style="font-size:.82rem;color:var(--muted);margin-bottom:.3rem;">运动导引</div>
          <div style="font-size:.88rem;color:var(--gold);">${plan.exercise}</div>
        </div>
        <div style="text-align:center;background:var(--bg);border-radius:12px;padding:1.2rem .8rem;">
          <div style="font-size:2rem;margin-bottom:.5rem;">💆</div>
          <div style="font-size:.82rem;color:var(--muted);margin-bottom:.3rem;">穴位按摩</div>
          <div style="font-size:.88rem;color:var(--gold);">${plan.acupoint}</div>
        </div>
        <div style="text-align:center;background:var(--bg);border-radius:12px;padding:1.2rem .8rem;">
          <div style="font-size:2rem;margin-bottom:.5rem;">😴</div>
          <div style="font-size:.82rem;color:var(--muted);margin-bottom:.3rem;">作息调整</div>
          <div style="font-size:.88rem;color:var(--gold);">${plan.sleep}</div>
        </div>
      </div>
      <div style="background:rgba(201,169,110,.06);border-left:2px solid var(--gold);padding:.8rem 1rem;border-radius:0 var(--r-sm) var(--r-sm) 0;margin-top:1rem;">
        <div style="font-size:.82rem;color:var(--gold);margin-bottom:.3rem;">📜 经典启示</div>
        <div style="font-size:.85rem;font-style:italic;color:var(--text-2);">${plan.classic}</div>
        <div style="font-size:.82rem;color:var(--text-3);margin-top:.3rem;">${plan.emotion}</div>
      </div></div>`;
'''

# 原来的 section ③ 标记（插入点：在这行之前插入新内容）
marker = '    // ③ 十神格局（新增）'

if marker in content:
    # 在标记行之前插入新 section
    new_content = content.replace(marker, new_section + '\n' + marker, 1)
    with open(r'C:\Users\刘\Desktop\lingshu\js\app.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('成功：已插入六维调理方案 section')
else:
    print('错误：未找到标记行，文件可能已被修改')
