/**
 * 玄机阁 · 应用主逻辑 v3.0
 * 独立站风格 · 奶茶燕麦配色
 */
(function () {
  const D = window.XJG_DATA;
  const E = window.XJG_ENGINE;

  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(id);
    if (page) page.classList.add('active');
    document.querySelectorAll('.navbar nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`.navbar nav a[data-page="${id}"]`)?.classList.add('active');
    window.scrollTo(0, 0);
  }
  // 全局页面跳转函数（供HTML onclick调用）
  window.goPage = showPage;

  function submitForm() {
    var errBox = document.getElementById('_errBox') || (function(){
      var d = document.createElement('div');
      d.id = '_errBox';
      d.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#fff;color:#C97B7B;padding:15px;font-size:14px;border-bottom:2px solid #C97B7B;';
      document.body.appendChild(d);
      return d;
    })();
    errBox.style.display = 'none';
    
    try {
      var form = document.getElementById('profileForm');
      if (!form) { throw new Error('找不到表单profileForm'); }
      
      var fd = new FormData(form);
      var name = fd.get('name');
      var birthYear = parseInt(fd.get('birthYear'));
      var birthMonth = parseInt(fd.get('birthMonth'));
      var birthDay = parseInt(fd.get('birthDay'));
      var birthHour = parseInt(fd.get('birthHour')) || 12;
      var bloodType = fd.get('bloodType');
      var constitution = fd.get('constitution');
      
      if (!name || !birthYear || !bloodType || !constitution) {
        throw new Error('请填写姓名、出生日期、血型和体质');
      }
      
      // 调用引擎
      var E = window.XJG_ENGINE;
      if (!E || !E.analyze) { throw new Error('分析引擎未加载'); }
      
      var r = E.analyze({
        name: name, gender: fd.get('gender'),
        birthYear: birthYear, birthMonth: birthMonth,
        birthDay: birthDay, birthHour: birthHour,
        bloodType: bloodType, constitution: constitution,
        profession: fd.get('profession'), healthFocus: fd.get('healthFocus')
      });
      
      if (!r || !r.bazi) { throw new Error('引擎返回数据异常'); }
      
      // 渲染报告（加保护，出错也跳转并显示部分内容）
      try {
        renderReport(r);
      } catch(renderErr) {
        // 渲染失败时至少显示基本信息
        var rc = document.getElementById('reportContent');
        if (rc) {
          rc.innerHTML = '<div class="card"><h3>基础报告</h3>' +
            '<p>姓名: ' + (r.name||'') + '</p>' +
            '<p>八字: ' + (r.bazi? r.bazi.year+' '+r.bazi.month+' '+r.bazi.day+' '+r.bazi.hour : '') + '</p>' +
            '<p>日主: ' + (r.bazi? r.bazi.dayMaster : '') + '</p>' +
            '<p>体质: ' + (r.constitution||'') + '</p>' +
            '<p style="color:#C97B7B;">完整报告渲染出错: ' + renderErr.message + '</p></div>';
        }
      }
      
      // 切换页面
      showPage('reportPage');
      
    } catch(err) {
      errBox.textContent = '错误: ' + err.message;
      errBox.style.display = 'block';
      console.error(err);
    }
  }
  // 暴露到全局，供 onclick 直接调用
  window._submitForm = submitForm;

  // 弹窗控制
  function openModal(html) {
    document.getElementById('hexModalContent').innerHTML = html;
    document.getElementById('hexModal').classList.add('show');
  }
  function closeModal() {
    document.getElementById('hexModal').classList.remove('show');
  }

  // ============ 报告渲染（升级版）============
  function renderReport(r) {
    const wxColors = { '木':'var(--wood)','火':'var(--fire)','土':'var(--earth)','金':'var(--metal)','水':'var(--water)' };
    let html = `<h2 style="color:var(--gold);text-align:center;margin-bottom:1.5rem;">《${r.name} · 综合提运报告》</h2>`;

    // ① 命盘总览（含纳音）
    html += `<div class="card"><h3>① 个人命盘总览</h3>
      <div class="bazi-pillars" style="margin-bottom:1.2rem;">
        ${['year','month','day','hour'].map((p,i) => {
          const gz = r.bazi[p]; const stem=gz[0],branch=gz[1];
          return `<div class="bazi-pillar"><div class="label">${['年柱','月柱','日柱','时柱'][i]}</div>
            <div class="gan">${stem}</div><div class="zhi">${branch}</div>
            <div class="wx">${D.WUXING_OF_STEM[stem]}/${D.WUXING_OF_BRANCH[branch]}</div>
            <div style="font-size:.65rem;color:var(--muted);margin-top:.2rem;">${r.nayin[p]}</div></div>`;
        }).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;font-size:.88rem;">
        <div>日主：<b style="color:var(--gold)">${r.bazi.dayMaster}（${r.wuxing.dayMasterWx}）</b></div>
        <div>生肖：<b>${r.bazi.zodiac}</b></div>
        <div>星座：<b style="color:var(--accent)">${r.constellation.name}</b>（${r.constellation.element}象）</div>
        <div>血型：<b>${r.bloodType}型</b></div>
        <div>体质：<b style="color:var(--green)">${r.constitution}</b></div>
        <div>喜用神：<b style="color:var(--gold)">${r.wuxing.yongshen}</b>（${r.wuxing.isStrong?'身强宜克泄':'身弱宜生扶'}）</div>
        <div>命卦：<b>${r.fengshui.gua}</b>（${r.fengshui.life}）</div>
        <div>当前节气：<b>${r.currentTerm}</b></div>
      </div></div>`;

    // ② 五行能量
    html += `<div class="card"><h3>② 五行能量分布</h3>
      ${Object.entries(r.wuxing.counts).map(([wx,count]) => {
        const pct = r.wuxing.percentages[wx];
        return `<div class="wx-bar"><span class="wx-name" style="color:${wxColors[wx]}">${wx}</span>
          <div class="wx-track"><div class="wx-fill" style="width:${Math.max(pct,5)}%;background:${wxColors[wx]}">${count}个</div></div>
          <span class="wx-pct">${pct}%</span></div>`;
      }).join('')}
      <div class="sub" style="margin-top:1rem;">最强：<b style="color:${wxColors[r.wuxing.strongest]}">${r.wuxing.strongest}</b>　最弱：<b style="color:${wxColors[r.wuxing.weakest]}">${r.wuxing.weakest}</b>　喜用：<b style="color:var(--gold)">${r.wuxing.yongshen}</b></div></div>`;

    // ③ 十神格局（新增）
    html += `<div class="card"><h3>③ 十神格局分析</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem;margin-bottom:.8rem;">
        <div style="text-align:center;background:var(--bg);border-radius:8px;padding:.6rem;"><div style="font-size:.75rem;color:var(--muted)">年干</div><div style="font-size:1.1rem;color:var(--gold)">${r.tenGods.yearGod}</div><div style="font-size:.75rem">${r.tenGods.yearStem}</div></div>
        <div style="text-align:center;background:var(--bg);border-radius:8px;padding:.6rem;"><div style="font-size:.75rem;color:var(--muted)">月干</div><div style="font-size:1.1rem;color:var(--gold)">${r.tenGods.monthGod}</div><div style="font-size:.75rem">${r.tenGods.monthStem}</div></div>
        <div style="text-align:center;background:var(--bg);border-radius:8px;padding:.6rem;"><div style="font-size:.75rem;color:var(--muted)">时干</div><div style="font-size:1.1rem;color:var(--gold)">${r.tenGods.hourGod}</div><div style="font-size:.75rem">${r.tenGods.hourStem}</div></div>
      </div>
      <div class="sub">${D.TEN_GODS_MEANING[r.tenGods.monthGod] || ''}（月令十神主导性格）</div>
      ${r.shensha.length ? `<div style="margin-top:.5rem;">${r.shensha.map(s=>`<span class="tag tag-gold">${s.name}</span> ${s.desc}`).join('<br>')}</div>` : ''}</div>`;

    // ④ 大运流年（新增）
    html += `<div class="card"><h3>④ 大运流年</h3>
      <div class="sub">起运 ${r.dayun.startAge} 岁，${r.dayun.forward?'顺排':'逆排'}（阳男阴女顺排）</div>
      <div style="display:flex;gap:.4rem;overflow-x:auto;padding-bottom:.5rem;margin-bottom:1rem;">
        ${r.dayun.dayuns.map((d,i) => {
          const age = new Date().getFullYear() - parseInt(document.querySelector('[name=birthYear]').value);
          const isCurrent = age >= d.age && age <= d.endAge;
          return `<div style="min-width:80px;text-align:center;background:${isCurrent?'rgba(212,175,55,.15)':'var(--bg)'};border:1px solid ${isCurrent?'var(--gold)':'var(--border)'};border-radius:8px;padding:.5rem;">
            <div style="font-size:.7rem;color:var(--muted)">${i===0?'起运':''}</div>
            <div style="font-size:1.1rem;color:${isCurrent?'var(--gold)':'var(--text)'}">${d.gan}${d.zhi}</div>
            <div style="font-size:.7rem;color:var(--muted)">${d.age}-${d.endAge}岁</div>
            ${isCurrent?'<div style="font-size:.65rem;color:var(--gold)">★当前</div>':''}
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:.8rem;"><b>${r.liunian.year}年流年：</b><span style="color:var(--gold)">${r.liunian.ganZhi}</span>（${r.liunian.zodiac}年）</div>
      <div class="sub">流年十神：<b style="color:var(--accent)">${r.liunian.god}</b>　${D.TEN_GODS_MEANING[r.liunian.god]||''}<br>
      ${r.liunian.isChong?'⚠ 流年冲太岁（年柱），变动较大，宜稳不宜动':r.liunian.isHe?'✓ 流年合太岁，顺遂之年':'流年与年柱平和'}</div></div>`;

    // ⑤ 性格多维画像
    html += `<div class="card"><h3>⑤ 性格多维度画像</h3>
      <div style="margin-bottom:.6rem;"><span class="tag tag-gold">八字</span> 日主${r.bazi.dayMaster}${r.wuxing.dayMasterWx}，${r.tenGods.monthGod}格，${r.wuxing.isStrong?'个性强旺':'个性内敛'}。${D.TEN_GODS_MEANING[r.tenGods.monthGod]||''}</div>
      <div style="margin-bottom:.6rem;"><span class="tag" style="background:rgba(88,166,255,.1);color:var(--accent)">星座</span> ${r.constellation.name}：${r.constellation.traits}</div>
      <div style="margin-bottom:.6rem;"><span class="tag" style="background:rgba(248,81,73,.1);color:var(--red)">血型</span> ${r.bloodType}型：${r.blood.personality}</div>
      <div><span class="tag" style="background:rgba(63,185,80,.1);color:var(--green)">体质</span> ${r.constitution}质：${r.constit.desc}</div></div>`;

    // ⑥ 运势评分
    const scores = calcScores(r);
    html += `<div class="card"><h3>⑥ 运势综合评分</h3><div class="score-grid">
      ${scores.map(s => `<div class="score-item"><div class="score-label">${s.label}</div><div class="score-val">${s.val}</div>
        <div class="score-bar"><div class="score-fill" style="width:${s.val}%;background:${s.color}"></div></div>
        <div class="sub" style="font-size:.75rem;margin-top:.3rem;">${s.tip}</div></div>`).join('')}
    </div></div>`;

    // ⑦ 调运·穿戴（详细版）
    const wd = r.wearData;
    html += `<div class="card"><h3>⑦ 调运·穿戴篇</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:.8rem;">
        <div><b>幸运色：</b><span style="color:var(--gold)">${wd.colors.join('、')}</span></div>
        <div><b>材质：</b>${wd.materials.join('、')}</div>
        <div><b>配饰：</b>${wd.accessories.join('、')}</div>
        <div><b>幸运方向：</b>${r.yongshenData.direction}方</div>
      </div>
      <div style="margin-bottom:.4rem;"><b>职场穿搭：</b>${wd.scenes['职场']}</div>
      <div style="margin-bottom:.4rem;"><b>约会穿搭：</b>${wd.scenes['约会']}</div>
      <div><b>重要日：</b>${wd.scenes['重要日']}</div>
      ${wd.avoid ? `<div class="sub" style="color:var(--red)">⚠ 穿戴禁忌：${wd.avoid.join('、')}</div>` : ''}</div>`;

    // ⑧ 调运·艾灸经络
    const cm = r.constit.moxa;
    html += `<div class="card"><h3>⑧ 调运·艾灸经络篇</h3>
      <div style="margin-bottom:.6rem;"><b>体质施灸方：</b><br>${cm.points.map(p=>`<span class="acupoint">${p}</span>`).join('')}</div>
      <div class="sub">${cm.method}</div>
      <div style="margin-bottom:.6rem;"><b>五行喜用灸方：</b>喜${r.wuxing.yongshen}→调${r.yongshenData.organ}<br><span class="acupoint">${getWuxingMoxa(r.wuxing.yongshen)}</span></div>
      <div style="margin-bottom:.6rem;"><b>当前节气灸（${r.currentTerm}）：</b><br>${r.termMoxa.points.map(p=>`<span class="acupoint">${p}</span>`).join('')}<div class="sub">${r.termMoxa.focus}</div></div>
      <div style="margin-bottom:.6rem;"><b>蕲艾五官灸：</b><br><span style="font-size:.85rem;color:var(--muted)">日常保养五官，可前往"五官灸"页面查看详细方案</span></div>
      <div class="sub" style="color:var(--red)">⚠ 艾灸禁忌：过饥过饱不宜灸；孕妇腰腹禁灸；阴虚火旺者轻灸。养生保健参考，非医疗建议。</div></div>`;

    // ⑨ 调运·药食同源（多方案）
    html += `<div class="card"><h3>⑨ 调运·药食同源篇</h3>
      <div class="sub">为您匹配 ${r.herbFormulas.length} 个${r.constitution}质食疗方</div>
      ${r.herbFormulas.map((hf,i) => `
      <div style="background:var(--bg);border-radius:8px;padding:1rem;margin-bottom:.8rem;${i===0?'border:1px solid var(--gold)':''}">
        <div style="margin-bottom:.3rem;"><b>${hf.name}</b> ${i===0?'<span class="tag tag-gold">首选</span>':''} <span class="tag">${hf.constitution}质</span></div>
        <div style="font-size:.8rem;color:var(--muted);margin-bottom:.3rem;">出处：${hf.source}</div>
        <div style="font-size:.85rem;margin-bottom:.2rem;"><b>药材：</b>${hf.herbs.map(h=>`${h.name}(${h.dose})`).join('、')}</div>
        <div style="font-size:.85rem;margin-bottom:.2rem;"><b>食材：</b>${hf.ingredients.join('、')}</div>
        <div style="font-size:.85rem;margin-bottom:.2rem;"><b>做法：</b>${hf.method}</div>
        <div style="font-size:.85rem;margin-bottom:.2rem;"><b>功效：</b><span style="color:var(--green)">${hf.efficacy}</span></div>
        <div style="font-size:.75rem;color:var(--red)">禁忌：${hf.taboo}</div>
      </div>`).join('')}</div>`;

    // ⑩ 调运·风水
    html += `<div class="card"><h3>⑩ 调运·环境风水篇</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
        <div><b>命卦：</b>${r.fengshui.gua}（${r.fengshui.life}）</div>
        <div><b>吉位方位：</b>${r.fengshui.luckyDir.join('、')}</div>
        <div><b>卧室方位：</b>${r.fengshui.bedroom}</div>
        <div><b>书桌朝向：</b>${r.fengshui.desk}</div>
      </div></div>`;

    // ⑪ 生物钟 + 子午流注
    const br = r.biorhythm;
    html += `<div class="card"><h3>⑪ 生物钟 · 子午流注</h3>
      <div class="sub">已出生 ${br.days} 天</div>
      ${renderBiorhythm('体力', br.physical, 'var(--green)')}
      ${renderBiorhythm('情绪', br.emotional, 'var(--accent)')}
      ${renderBiorhythm('智力', br.intellectual, 'var(--gold)')}
      <div style="margin-top:1rem;padding-top:.8rem;border-top:1px solid var(--border);"><b>今日子午流注作息建议：</b></div>
      <div style="font-size:.82rem;margin-top:.4rem;">${r.ziwuliuzhu.filter(z=>['子时','午时','辰时','申时','亥时'].some(k=>z.time.includes(k))).map(z=>`<div style="margin:.2rem 0;">${z.time}（${z.meridian}）：${z.advice}</div>`).join('')}</div>
      </div>`;

    // ⑫ 运动调运（新增详细版）
    html += `<div class="card"><h3>⑫ 调运·运动篇</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.6rem;">
        <div><b>推荐运动：</b>${r.exercise.sports.join('、')}</div>
        <div><b>最佳时辰：</b>${r.exercise.time}</div>
        <div><b>运动强度：</b>${r.exercise.intensity}</div>
        <div><b>建议频次：</b>${r.exercise.frequency}</div>
      </div>
      <div class="sub">${r.exercise.note}</div></div>`;

    // ⑬ 综合行动清单
    html += `<div class="card"><h3>⑬ 综合提运行动清单</h3><ul class="checklist">
      <li><span class="dot">●</span> 每日着装以${wd.colors[0]}系为主，佩戴${wd.accessories[0]}</li>
      <li><span class="dot">●</span> 艾灸${cm.points.slice(0,2).join('、')}，每穴15分钟，${(r.constitution==='阳虚'||r.constitution==='气虚')?'每日':'隔日'}一次</li>
      <li><span class="dot">●</span> 常服${r.herbFormula.name}，补${r.wuxing.yongshen}调${r.yongshenData.organ}</li>
      <li><span class="dot">●</span> 运动宜${r.exercise.sports[0]}，${r.exercise.time}进行，${r.exercise.frequency}</li>
      <li><span class="dot">●</span> 书桌朝${r.fengshui.desk.replace('面','')}方，利用吉位</li>
      <li><span class="dot">●</span> ${r.currentTerm}节气加灸${r.termMoxa.points[0]}穴</li>
      <li><span class="dot">●</span> 23点前入睡（子时养胆），午时小憩15分钟</li>
      <li><span class="dot">●</span> ${r.liunian.year}年流年${r.liunian.god}，${r.liunian.isChong?'宜稳不宜动':r.liunian.isHe?'把握机遇顺水推舟':'平稳发展'}</li>
    </ul></div>`;

    // 产品推荐
    html += `<div class="card"><h3>🛒 个性化产品推荐</h3>
      <div class="product-grid">${r.recommendedProducts.map(p =>
        `<div class="product-card" onclick="alert('${p.name}\\n${p.desc}')">
          <div class="p-icon">${p.image}</div><div class="p-name">${p.name}</div>
          <div class="p-desc">${p.desc}</div><div class="p-price">¥${p.price}</div>
          <div class="p-tag">${p.tag}</div></div>`
      ).join('')}</div></div>`;

    html += `<div class="disclaimer">⚠ 免责声明：本报告为民俗文化娱乐参考与养生保健建议，不构成医疗诊断、投资决策依据。艾灸、药食同源方剂为保健养生参考，如有疾病请咨询专业医师。</div>`;

    document.getElementById('reportContent').innerHTML = html;
  }

  function renderBiorhythm(label, val, color) {
    const pct = Math.abs(val) / 2;
    const isPositive = val >= 0;
    return `<div class="biorhythm-bar">
      <div class="br-label"><span>${label}</span><span style="color:${isPositive?'var(--green)':'var(--red)'}">${isPositive?'高峰期':'低谷期'} ${Math.round(val)}%</span></div>
      <div class="br-track"><div class="br-mid"></div>
        <div class="br-fill" style="${isPositive?'left:50%':'right:50%'};width:${pct}%;background:${color};opacity:.7"></div>
      </div></div>`;
  }

  function getWuxingMoxa(wx) {
    const map = { '木':'太冲·阳陵泉','火':'命门·关元','土':'足三里·中脘','金':'肺俞·尺泽','水':'肾俞·太溪' };
    return map[wx] || '足三里';
  }

  function calcScores(r) {
    const wuxingBalance = 100 - Math.max(...Object.values(r.wuxing.counts)) * 12;
    const liunianBonus = r.liunian.isHe ? 8 : r.liunian.isChong ? -5 : 0;
    return [
      { label:'事业运', val: Math.min(95, 60 + r.wuxing.percentages[r.wuxing.yongshen] + 15 + liunianBonus), color:'var(--gold)', tip:`喜用${r.wuxing.yongshen}·流年${r.liunian.god}` },
      { label:'财运', val: Math.min(90, 55 + (r.wuxing.counts['土']||0)*8 + 10 + liunianBonus), color:'var(--earth)', tip:`土${r.wuxing.counts['土']||0}个主财` },
      { label:'感情运', val: Math.min(90, 58 + (r.wuxing.counts['水']||0)*6 + 12 + liunianBonus), color:'var(--accent)', tip:`水${r.wuxing.counts['水']||0}个主情` },
      { label:'健康运', val: Math.max(40, wuxingBalance), color:'var(--green)', tip:`五行${r.wuxing.strongest}旺需调和` }
    ];
  }

  // ============ 典籍库 ============
  function renderClassics(filter) {
    const list = filter && filter !== '全部' ? D.CLASSICS_LIBRARY.filter(c => c.system === filter) : D.CLASSICS_LIBRARY;
    const systems = ['全部', ...new Set(D.CLASSICS_LIBRARY.map(c => c.system))];
    let html = `<div class="filter-bar">${systems.map(s => `<span class="${(filter||'全部')===s?'active':''}" onclick="XJG_APP.filterClassics('${s}')">${s}</span>`).join('')}</div>`;
    html += list.map(c => `<div class="list-card">
      <div class="priority">${c.priority==='P0'?'⭐':c.priority==='P1'?'🌟':'📌'}</div>
      <div class="info"><h4>《${c.title}》</h4>
      <div class="meta">${c.dynasty}·${c.author}　|　${c.system}　|　${c.category}</div>
      <div class="desc">${c.desc}</div></div></div>`).join('');
    document.getElementById('classicsContent').innerHTML = html;
  }

  // ============ 推背图 ============
  function renderTuibeitu() {
    let html = `<div class="filter-bar"><span class="active" onclick="XJG_APP.filterTuibeitu('all')">全部60象</span><span onclick="XJG_APP.filterTuibeitu('early')">第1-20象</span><span onclick="XJG_APP.filterTuibeitu('mid')">第21-40象</span><span onclick="XJG_APP.filterTuibeitu('late')">第41-60象</span></div>`;
    html += `<div class="product-grid">${D.TUIBEITU.map(t => `<div class="product-card" onclick="XJG_APP.showTuibeitu(${t.xiang})" style="cursor:pointer;">
      <div style="font-size:1.8rem;">📜</div>
      <div class="p-name">第${t.xiang}象 · ${t.gua}卦</div>
      <div class="p-desc" style="-webkit-line-clamp:2;overflow:hidden;">${t.chan.substring(0,30)}...</div>
    </div>`).join('')}</div>`;
    document.getElementById('tuibeituContent').innerHTML = html;
  }

  function showTuibeitu(num) {
    const t = D.TUIBEITU.find(x => x.xiang === num);
    if (!t) return;
    document.getElementById('hexModalContent').innerHTML = `
      <div style="text-align:center;margin-bottom:1rem;"><div style="font-size:3rem;">📜</div>
      <div style="font-size:1.2rem;color:var(--gold);margin-top:.3rem;">${t.title}</div></div>
      <div class="card"><b>谶曰：</b><br>${t.chan}</div>
      <div class="card"><b>颂曰：</b><br>${t.song}</div>
      <div class="card"><b>注解：</b><br>${t.note}</div>`;
    document.getElementById('hexModal').classList.add('show');
  }

  function filterTuibeitu(range) {
    let list = D.TUIBEITU;
    if (range === 'early') list = D.TUIBEITU.filter(t => t.xiang <= 20);
    else if (range === 'mid') list = D.TUIBEITU.filter(t => t.xiang > 20 && t.xiang <= 40);
    else if (range === 'late') list = D.TUIBEITU.filter(t => t.xiang > 40);
    let html = `<div class="product-grid">${list.map(t => `<div class="product-card" onclick="XJG_APP.showTuibeitu(${t.xiang})" style="cursor:pointer;">
      <div style="font-size:1.8rem;">📜</div><div class="p-name">第${t.xiang}象 · ${t.gua}卦</div>
      <div class="p-desc" style="-webkit-line-clamp:2;overflow:hidden;">${t.chan.substring(0,30)}...</div></div>`).join('')}</div>`;
    if (range === 'all') html = `<div class="filter-bar"><span class="active" onclick="XJG_APP.filterTuibeitu('all')">全部60象</span><span onclick="XJG_APP.filterTuibeitu('early')">第1-20象</span><span onclick="XJG_APP.filterTuibeitu('mid')">第21-40象</span><span onclick="XJG_APP.filterTuibeitu('late')">第41-60象</span></div>` + html;
    document.getElementById('tuibeituContent').innerHTML = html;
  }

  // ============ 蕲艾五官灸 ============
  function renderWuguan() {
    const organs = [
      { organ:'耳', icon:'👂', visceras:'肾/胆', color:'var(--water)' },
      { organ:'鼻', icon:'👃', visceras:'肺', color:'var(--metal)' },
      { organ:'眼', icon:'👁️', visceras:'肝', color:'var(--wood)' },
      { organ:'喉', icon:'🗣️', visceras:'肺/肾', color:'var(--metal)' },
      { organ:'口', icon:'👄', visceras:'脾/心', color:'var(--earth)' }
    ];
    let html = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:1.5rem;">`;
    html += organs.map(o => `<div class="feature" onclick="XJG_APP.showWuguan('${o.organ}')" style="border-color:${o.color};">
      <div class="icon" style="font-size:2.5rem;">${o.icon}</div><h4 style="color:${o.color}">${o.organ}灸</h4><p>对应：${o.visceras}</p></div>`).join('');
    html += `</div>`;

    // 五官灸总览表
    html += `<div class="card"><h3>五官灸方案总览</h3>
      <div style="font-size:.85rem;">${D.WUGUAN_MOXA.map(w => `<div style="display:flex;align-items:center;gap:.5rem;padding:.5rem 0;border-bottom:1px solid var(--border);">
        <span style="font-size:1.3rem;width:30px;">${organs.find(o=>o.organ===w.organ)?.icon||''}</span>
        <span style="width:30px;color:var(--gold);font-weight:bold;">${w.organ}</span>
        <span style="width:80px;font-size:.8rem;color:var(--muted)">${w.visceras}</span>
        <span style="flex:1;">${w.points.map(p=>`<span class="acupoint">${p}</span>`).join('')}</span>
        <span style="font-size:.75rem;color:var(--muted);width:120px;text-align:right;">${w.scene}</span>
      </div>`).join('')}</div></div>`;

    // 蕲艾特色介绍
    html += `<div class="card"><h3>🌿 蕲艾道地性</h3>
      <div style="font-size:.9rem;line-height:1.8;">
        <b style="color:var(--gold)">《本草纲目》载：</b>"艾叶……以蕲州者为胜。"<br><br>
        蕲艾产于湖北蕲春，因其独特的地理气候条件，挥发油含量远高于普通艾草。蕲春艾灸疗法为<b>国家级非物质文化遗产</b>，其特色在于：<br>
        <span class="dot" style="color:var(--gold)">●</span> 选材道地：三年以上陈蕲艾，火力温和渗透<br>
        <span class="dot" style="color:var(--gold)">●</span> 技法独特：蕲春古法灸技，循经感传明显<br>
        <span class="dot" style="color:var(--gold)">●</span> 五官通调：以耳鼻眼喉口为切入，通调五脏<br>
        <span class="dot" style="color:var(--gold)">●</span> 药灸并用：配合药食同源，内外兼修
      </div></div>`;
    document.getElementById('wuguanContent').innerHTML = html;
  }

  function showWuguan(organ) {
    const w = D.WUGUAN_MOXA.find(x => x.organ === organ);
    if (!w) return;
    const organInfo = {
      '耳': { icon:'👂', desc:'肾开窍于耳，胆经绕耳。耳灸可补肾聪耳，改善耳鸣、听力下降。', products:['蕲艾条 5:1','蕲艾五官灸套装'] },
      '鼻': { icon:'👃', desc:'肺开窍于鼻。鼻灸可通鼻窍、散风寒，改善鼻炎、鼻塞。', products:['蕲艾条 8:1','蕲艾五官灸套装'] },
      '眼': { icon:'👁️', desc:'肝开窍于目。眼周灸可养肝明目，缓解视疲劳、干涩。', products:['蕲艾随身灸贴','蕲艾五官灸套装'] },
      '喉': { icon:'🗣️', desc:'肺系喉咙，肾脉贯喉。喉灸可润肺利咽，改善咽喉不适。', products:['蕲艾条 5:1','蕲艾五官灸套装'] },
      '口': { icon:'👄', desc:'脾开窍于口，心开窍于舌。口灸可健脾清心，改善口腔问题。', products:['气虚体质养生茶包','蕲艾五官灸套装'] }
    };
    const info = organInfo[organ];
    document.getElementById('hexModalContent').innerHTML = `
      <div style="text-align:center;margin-bottom:1rem;"><div style="font-size:3rem;">${info.icon}</div>
      <div style="font-size:1.3rem;color:var(--gold);margin-top:.3rem;">${organ}灸方案</div>
      <div style="font-size:.85rem;color:var(--muted)">对应脏腑：${w.visceras}</div></div>
      <div class="card"><b>适用场景：</b>${w.scene}</div>
      <div class="card"><b>调养原理：</b>${info.desc}</div>
      <div class="card"><b>施灸穴位：</b><br>${w.points.map(p=>`<span class="acupoint">${p}</span>`).join('')}<br><br>
      <b>灸法：</b>温和灸，每穴10-15分钟，每日或隔日1次<br>
      <b>疗程：</b>10次为一疗程，休息3-5天</div>
      <div class="card"><b>推荐产品：</b><br>${info.products.map(p=>`<span class="tag tag-gold">${p}</span>`).join(' ')}</div>
      <div class="sub" style="color:var(--red)">⚠ 免责声明：五官灸为养生保健参考，非医疗建议。面部施灸需注意温度，避免烫伤。</div>`;
    document.getElementById('hexModal').classList.add('show');
  }

  // ============ 产品库 ============
  function renderProducts(filter) {
    const cats = ['全部', ...new Set(D.PRODUCTS.map(p => p.category))];
    const list = filter && filter !== '全部' ? D.PRODUCTS.filter(p => p.category === filter) : D.PRODUCTS;
    let html = `<div class="filter-bar">${cats.map(c => `<span class="${(filter||'全部')===c?'active':''}" onclick="XJG_APP.filterProducts('${c}')">${c}</span>`).join('')}</div>`;
    html += `<div class="product-grid">${list.map(p => `<div class="product-card">
      <div class="p-icon">${p.image}</div><div class="p-name">${p.name}</div>
      <div class="p-desc">${p.desc}</div><div class="p-price">¥${p.price}</div>
      <div class="p-tag">${p.tag}</div></div>`).join('')}</div>`;
    document.getElementById('productsContent').innerHTML = html;
  }

  // ============ 64卦占卜 ============
  function renderHexagrams() {
    const hexagrams = D.HEXAGRAMS_FULL || D.HEXAGRAMS;
    let html = `<div class="card"><h3>☰ 周易六十四卦</h3><div class="sub">收录完整六十四卦，点击查看卦辞、象传、运势解读</div></div>`;
    html += `<div class="product-grid">${hexagrams.map(h => `<div class="product-card" onclick="XJG_APP.showHexagram(${h.num})" style="cursor:pointer;">
      <div class="hexagram"><div class="symbol">${h.symbol}</div><div class="name">${h.name}</div></div>
      <div class="p-desc">${h.chinese}</div></div>`).join('')}</div>`;
    document.getElementById('divineContent').innerHTML = html;
  }

  function showHexagram(num) {
    const hexagrams = D.HEXAGRAMS_FULL || D.HEXAGRAMS;
    const h = hexagrams.find(x => x.num === num);
    if (!h) return;
    document.getElementById('hexModalContent').innerHTML = `
      <div class="hexagram"><div class="symbol" style="font-size:3.5rem;">${h.symbol}</div>
      <div class="name">第${h.num}卦 · ${h.name}（${h.chinese}）</div></div>
      <div class="card" style="margin-top:1rem;"><b>卦辞：</b>${h.judge}</div>
      <div class="card"><b>象传：</b>${h.image}</div>
      <div class="card"><b>释义：</b>${h.meaning}</div>
      <div class="card"><b>运势：</b><span style="color:var(--gold)">${h.fortune}</span></div>`;
    document.getElementById('hexModal').classList.add('show');
  }

  // ============ 体质自测问卷 ============
  function renderQuiz() {
    const quiz = D.CONSTITUTION_QUIZ;
    let html = `<div class="card"><div style="font-size:.9rem;color:var(--muted);margin-bottom:1rem;">
      请根据您<b>最近三个月</b>的实际感受回答以下问题。每题5个选项，选择最符合您的程度。</div></div>`;
    html += `<div id="quizQuestions">`;
    quiz.questions.forEach((q, i) => {
      html += `<div class="quiz-item" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:.6rem;">
        <div style="display:flex;gap:.5rem;align-items:flex-start;margin-bottom:.6rem;">
          <span style="color:var(--gold);font-weight:bold;min-width:28px;">${i+1}.</span>
          <span style="flex:1;">${q.text}</span>
          <span class="tag" style="white-space:nowrap;">${q.type}质</span>
        </div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;padding-left:32px;">
          ${quiz.scale.map(s => `<label style="display:flex;align-items:center;gap:.2rem;cursor:pointer;font-size:.8rem;padding:.3rem .6rem;border:1px solid var(--border);border-radius:6px;transition:.2s;" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'">
            <input type="radio" name="q${q.id}" value="${s.val}" style="display:none;" onchange="this.parentElement.style.background='rgba(212,175,55,.15)';this.parentElement.style.borderColor='var(--gold)';XJG_APP.updateQuizProgress();">
            ${s.label}
          </label>`).join('')}
        </div>
      </div>`;
    });
    html += `</div>`;
    html += `<div style="text-align:center;margin-top:1.5rem;">
      <div id="quizProgress" style="color:var(--muted);font-size:.85rem;margin-bottom:1rem;">已回答 0 / ${quiz.questions.length} 题</div>
      <button class="btn" onclick="XJG_APP.submitQuiz()">📊 提交并判定体质</button>
    </div>`;
    document.getElementById('quizContent').innerHTML = html;
  }

  function updateQuizProgress() {
    const answered = document.querySelectorAll('#quizQuestions input[type=radio]:checked').length;
    const total = D.CONSTITUTION_QUIZ.questions.length;
    const el = document.getElementById('quizProgress');
    if (el) el.textContent = `已回答 ${answered} / ${total} 题`;
  }

  function submitQuiz() {
    const answers = {};
    D.CONSTITUTION_QUIZ.questions.forEach(q => {
      const checked = document.querySelector(`input[name=q${q.id}]:checked`);
      if (checked) answers[q.id] = parseInt(checked.value);
    });
    const answered = Object.keys(answers).length;
    if (answered < 40) {
      alert(`请至少回答40题（当前${answered}题）以保证判定准确性`);
      return;
    }
    const result = window.XJG_ENGINE_CALC_CONSTITUTION(answers);
    showQuizResult(result);
  }

  function showQuizResult(result) {
    const constitutions = D.CONSTITUTIONS;
    let html = `<div class="card" style="border:1px solid var(--gold);">
      <h3 style="text-align:center;">📋 您的体质判定结果</h3>
      <div style="text-align:center;margin:1rem 0;">
        <div style="font-size:1.6rem;color:var(--gold);font-weight:bold;">${result.primary.type}质</div>
        <div style="color:var(--muted);font-size:.9rem;">转化分：${result.primary.score}分（${result.primary.level}）</div>
        <div style="font-size:.85rem;color:var(--muted);margin-top:.3rem;">${constitutions[result.primary.type]?.desc || ''}</div>
      </div>`;

    // 体质得分条
    html += `<div style="margin:1.2rem 0;">`;
    Object.entries(result.allScores).forEach(([type, score]) => {
      const isPrimary = type === result.primary.type;
      const color = isPrimary ? 'var(--gold)' : 'var(--accent)';
      html += `<div class="wx-bar"><span class="wx-name" style="color:${color};font-size:.8rem;">${type}</span>
        <div class="wx-track"><div class="wx-fill" style="width:${Math.max(score,2)}%;background:${color};${isPrimary?'opacity:1':'opacity:.5'}">${score}分</div></div>
        <span class="wx-pct" style="font-size:.75rem;">${score>=60?'是':score>=40?'倾向':'否'}</span></div>`;
    });
    html += `</div>`;

    // 偏颇体质列表
    if (result.results.length > 1) {
      html += `<div style="margin-top:.8rem;padding-top:.8rem;border-top:1px solid var(--border);">
        <b>兼夹体质：</b>${result.results.filter(r => r.type !== result.primary.type).map(r => `${r.type}质(${r.score}分,${r.level})`).join('、') || '无'}
      </div>`;
    }

    // 调养建议
    const constit = constitutions[result.primary.type];
    if (constit) {
      html += `<div style="margin-top:1rem;padding-top:.8rem;border-top:1px solid var(--border);">
        <h4 style="color:var(--gold);margin-bottom:.5rem;">调养建议</h4>
        <div style="font-size:.85rem;margin-bottom:.4rem;"><b>原则：</b>${constit.tune}</div>
        <div style="font-size:.85rem;margin-bottom:.4rem;"><b>艾灸：</b>${constit.moxa.points.join('、')}（${constit.moxa.method}）</div>
        <div style="font-size:.85rem;margin-bottom:.4rem;"><b>食疗：</b>${constit.diet.good.join('、')}</div>
        <div style="font-size:.85rem;"><b>推荐方：</b>${constit.diet.recipe}</div>
      </div>`;
    }

    html += `<div style="text-align:center;margin-top:1.5rem;display:flex;gap:.8rem;justify-content:center;">
      <button class="btn" onclick="XJG_APP.useResult('${result.primary.type}')">🔮 用此体质去分析命盘</button>
      <button class="btn btn-outline" onclick="XJG_APP.retakeQuiz()">重新自测</button>
    </div>`;

    html += `<div class="sub" style="margin-top:1rem;">⚠ 本自测基于中医体质分类标准，仅供养生参考，不作为医疗诊断依据。</div>
    </div>`;

    document.getElementById('quizContent').innerHTML = html;
    window.scrollTo(0, 0);
  }

  function useResult(type) {
    const sel = document.getElementById('constitutionSelect');
    if (sel) sel.value = type;
    showPage('profilePage');
  }

  function retakeQuiz() { renderQuiz(); window.scrollTo(0, 0); }

  // ============ 本草穴位浏览 ============
  function renderHerbs(filter) {
    const herbs = D.HERBS || [];
    const acupoints = D.ACUPOINTS || [];
    const tab = filter || 'herbs';
    let html = `<div class="filter-bar">
      <span class="${tab==='herbs'?'active':''}" onclick="XJG_APP.filterHerbs('herbs')">🌿 本草药材（${herbs.length}）</span>
      <span class="${tab==='acupoints'?'active':''}" onclick="XJG_APP.filterHerbs('acupoints')">📌 针灸穴位（${acupoints.length}）</span>
    </div>`;
    if (tab === 'herbs') {
      // 药食同源筛选
      const foodOnly = filter === 'food';
      const list = foodOnly ? herbs.filter(h => h.food === '是') : herbs;
      html += `<div style="margin-bottom:1rem;"><span class="tag tag-gold" onclick="XJG_APP.filterHerbs('herbs')" style="cursor:pointer;">全部药材</span> <span class="tag" onclick="XJG_APP.filterHerbsFood()" style="cursor:pointer;">仅药食同源</span></div>`;
      html += list.map(h => `<div class="list-card">
        <div class="priority">${h.food==='是'?'🍵':'💊'}</div>
        <div class="info"><h4>${h.name} <span style="font-size:.75rem;color:var(--muted)">${h.pinyin}</span> ${h.food==='是'?'<span class="tag tag-gold">药食同源</span>':''}</h4>
        <div class="meta">${h.source} | ${h.nature}性 | ${h.flavor}味 | 归${h.meridian}</div>
        <div class="desc"><b>功效：</b>${h.efficacy}</div>
        <div class="desc"><b>用法：</b>${h.usage}${h.taboo?'　⚠'+h.taboo:''}</div>
        ${h.note?`<div class="desc" style="color:var(--gold);font-style:italic;">${h.note}</div>`:''}
        </div></div>`).join('');
    } else {
      html += acupoints.map(a => `<div class="list-card">
        <div class="priority">📌</div>
        <div class="info"><h4>${a.name} <span class="tag">${a.category}</span></h4>
        <div class="meta">${a.meridian}</div>
        <div class="desc"><b>定位：</b>${a.location}</div>
        <div class="desc"><b>功效：</b>${a.efficacy}</div>
        <div class="desc"><b>灸法：</b>${a.usage}</div>
        </div></div>`).join('');
    }
    document.getElementById('herbsContent').innerHTML = html;
  }

  function filterHerbsFood() {
    const herbs = D.HERBS || [];
    let html = `<div class="filter-bar">
      <span onclick="XJG_APP.filterHerbs('herbs')" style="cursor:pointer;">🌿 本草药材（${herbs.length}）</span>
      <span class="active" onclick="XJG_APP.filterHerbs('acupoints')" style="cursor:pointer;">📌 针灸穴位</span>
    </div>`;
    html += `<div style="margin-bottom:1rem;"><span class="tag" onclick="XJG_APP.filterHerbs('herbs')" style="cursor:pointer;">全部药材</span> <span class="tag tag-gold">仅药食同源</span></div>`;
    html += herbs.filter(h => h.food === '是').map(h => `<div class="list-card">
      <div class="priority">🍵</div>
      <div class="info"><h4>${h.name} <span style="font-size:.75rem;color:var(--muted)">${h.pinyin}</span> <span class="tag tag-gold">药食同源</span></h4>
      <div class="meta">${h.source} | ${h.nature}性 | ${h.flavor}味 | 归${h.meridian}</div>
      <div class="desc"><b>功效：</b>${h.efficacy}</div>
      <div class="desc"><b>用法：</b>${h.usage}${h.taboo?'　⚠'+h.taboo:''}</div>
      ${h.note?`<div class="desc" style="color:var(--gold);font-style:italic;">${h.note}</div>`:''}
      </div></div>`).join('');
    document.getElementById('herbsContent').innerHTML = html;
  }

  // ============ 紫微斗数排盘 ============
  function renderZiwei() {
    const yearStem = document.getElementById('zwYearStem').value;
    const month = parseInt(document.getElementById('zwMonth').value);
    const day = parseInt(document.getElementById('zwDay').value);
    const hourBranch = document.getElementById('zwHour').value;

    const result = window.XJG_ZIWEI.paipan({ yearStem, month, day, hourBranch });

    let html = `<div class="card" style="border:1px solid var(--gold);">
      <h3 style="text-align:center;">⭐ 紫微斗数命盘</h3>
      <div style="text-align:center;color:var(--muted);font-size:.85rem;margin-bottom:1rem;">
        ${yearStem}年　农历${month}月${day}日　${hourBranch}时<br>
        命宫：${result.mingGong}宫　身宫：${result.shenGong}宫　${result.ju.ju}（${result.ju.nayin}）
      </div>`;

    // 12宫格（4×3）
    html += `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;font-size:.8rem;">`;
    result.palaces.forEach(p => {
      const bg = p.isMingGong ? 'rgba(212,175,55,.12);border:1px solid var(--gold)' :
                  p.isShenGong ? 'rgba(88,166,255,.1);border:1px solid var(--accent)' :
                  'var(--bg);border:1px solid var(--border)';
      html += `<div style="background:${bg};border-radius:8px;padding:.6rem;min-height:80px;">
        <div style="font-weight:bold;color:${p.isMingGong?'var(--gold)':p.isShenGong?'var(--accent)':'var(--text)'};">
          ${p.name}${p.isMingGong?' ★':''}${p.isShenGong?' ◆':''}
        </div>
        <div style="font-size:.7rem;color:var(--muted);margin-bottom:.2rem;">${p.branch}宫</div>
        <div style="font-size:.75rem;line-height:1.5;">
          ${p.stars.length ? p.stars.map(s => {
            const star = D.ZIWEI_STARS.find(z => z.name === s);
            return `<span style="color:${star&&star.type==='主星'?'var(--gold)':'var(--muted)'}">${s} </span>`;
          }).join('') : '<span style="color:var(--muted);font-size:.7rem;">（空宫）</span>'}
        </div>
      </div>`;
    });
    html += `</div>`;

    // 命宫详解
    const mingGong = result.palaces[0];
    html += `<div style="margin-top:1.2rem;padding-top:1rem;border-top:1px solid var(--border);">
      <h4 style="color:var(--gold);margin-bottom:.5rem;">命宫星曜解读</h4>`;
    if (mingGong.stars.length) {
      mingGong.stars.forEach(s => {
        const star = D.ZIWEI_STARS.find(z => z.name === s);
        if (star) {
          html += `<div style="margin-bottom:.4rem;"><b style="color:var(--gold)">${star.name}</b>（${star.nature}）：${star.traits}<br><span style="font-size:.8rem;color:var(--muted)">${star.palace}</span></div>`;
        }
      });
    } else {
      html += `<div style="color:var(--muted);">命宫无主星，需借对宫（迁移宫）星曜论命。`;
      const migrate = result.palaces[6];
      if (migrate.stars.length) {
        html += ` 借星：${migrate.stars.join('、')}`;
      }
      html += `</div>`;
    }
    html += `</div>`;

    // 说明
    html += `<div class="sub" style="margin-top:1rem;">★=命宫 ◆=身宫　紫微斗数为传统文化推演，仅供民俗文化参考。</div>
    </div>`;

    document.getElementById('ziweiContent').innerHTML = html;
  }

  // ============ 初始化 ============
  function init() {
    // 绑定导航
    document.querySelectorAll('.navbar nav a').forEach(a => {
      a.addEventListener('click', () => showPage(a.dataset.page));
    });
    // 绑定分析按钮 —— 双重保险
    var btn = document.getElementById('analyzeBtn');
    if (btn) {
      btn.removeEventListener('click', submitForm);
      btn.addEventListener('click', submitForm);
    }
    // 填充体质下拉框
    var sel = document.getElementById('constitutionSelect');
    if (sel && sel.options.length === 0) {
      Object.keys(D.CONSTITUTIONS).forEach(k => {
        sel.insertAdjacentHTML('beforeend', '<option value="' + k + '">' + k + '质 — ' + D.CONSTITUTIONS[k].desc.slice(0,12) + '...</option>');
      });
    }
    // 渲染各页面（容错）
    try { renderClassics('全部'); } catch(e) { console.warn('classics:', e); }
    try { renderProducts('全部'); } catch(e) { console.warn('products:', e); }
    try { renderHexagrams(); } catch(e) { console.warn('hexagrams:', e); }
    try { renderTuibeitu(); } catch(e) { console.warn('tuibeitu:', e); }
    try { renderQuiz(); } catch(e) { console.warn('quiz:', e); }
    try { renderHerbs('herbs'); } catch(e) { console.warn('herbs:', e); }
    try { renderZiwei(); } catch(e) { console.warn('ziwei:', e); }
    // 弹窗关闭
    var modal = document.getElementById('hexModal');
    if (modal) modal.addEventListener('click', e => { if (e.target.id === 'hexModal') closeModal(); });
  }

  window.XJG_APP = { filterClassics: renderClassics, filterProducts: renderProducts, showHexagram, filterTuibeitu: renderTuibeitu, showTuibeitu, filterHerbs: renderHerbs, filterHerbsFood, renderQuiz, updateQuizProgress, submitQuiz, useResult, retakeQuiz, renderZiwei, renderReport, closeModal, init };

  // 自动初始化：脚本在body末尾，DOM元素已就绪，直接调用 + DOMContentLoaded兜底
  try { init(); } catch(e) { console.error('init首次执行错误:', e); }
  document.addEventListener('DOMContentLoaded', function() {
    try { init(); } catch(e) { console.error('init DOMContentLoaded错误:', e); }
  });
})();
