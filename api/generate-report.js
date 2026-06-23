// api/generate-report.js
// Report generation — uses local BaZi engine + optional Deepseek AI enhancement

// Import the local engine (zero-cost BaZi calculation)
// On Vercel, this file runs in Node.js environment
// We need to load the engine from intl-engine.js

let engineLoaded = false;
let analyzeFn = null;

try {
  // Try to load the engine
  const engineCode = require('fs').readFileSync(__dirname + '/../intl-engine.js', 'utf8');
  // The engine uses IIFE pattern with window.XJG_ENGINE
  // In Node.js, we need to provide a window object
  global.window = global.window || {};
  eval(engineCode);
  analyzeFn = global.window.XJG_ENGINE.analyze;
  engineLoaded = !!analyzeFn;
} catch(e) {
  console.error('Engine load error:', e.message);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, birthDate, birthTime, birthPlace, gender, bloodType, constitution } = req.body;

  if (!birthDate) return res.status(400).json({ error: 'Birth date is required' });

  try {
    // Parse date and time
    var parts = birthDate.split('-');
    var birthYear = parseInt(parts[0]);
    var birthMonth = parseInt(parts[1]);
    var birthDay = parseInt(parts[2]);
    var birthHour = birthTime ? parseInt(birthTime.split(':')[0]) : 12;

    var reportData = null;

    // 1. Try local engine first (zero cost)
    if (engineLoaded) {
      reportData = analyzeFn({
        name: name || 'Seeker',
        gender: gender || '男',
        birthYear: birthYear,
        birthMonth: birthMonth,
        birthDay: birthDay,
        birthHour: birthHour,
        bloodType: bloodType || 'A',
        constitution: constitution || '平和'
      });
    }

    // 2. If engine failed, return error
    if (!reportData) {
      return res.status(500).json({ error: 'Engine not available' });
    }

    // 3. Optional: Enhance with Deepseek AI
    let enhancedText = null;
    if (process.env.DEEPSEEK_API_KEY && reportData.bazi) {
      try {
        enhancedText = await callDeepseek(reportData, name);
      } catch(e) {
        console.error('Deepseek error:', e.message);
        // Continue without AI enhancement
      }
    }

    res.status(200).json({
      success: true,
      data: reportData,
      enhanced: enhancedText,
      engine: 'local',
      timestamp: Date.now()
    });
  } catch(error) {
    console.error('Report generation error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Deepseek API call for enhanced report text
async function callDeepseek(reportData, name) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  var bazi = reportData.bazi;
  var wx = reportData.wuxing;
  
  var systemPrompt = 'You are an expert in Traditional Chinese Medicine and Five Elements (Wu Xing) philosophy, with deep knowledge of Huangdi Neijing and I Ching. Given the user\'s birth chart, analyze their Five Elements balance and generate a 5-dimension wellness plan. Always cite classical sources. Use a "cool, direct, non-sugarcoated" tone — like a wise but honest friend.';
  
  var userPrompt = JSON.stringify({
    name: name,
    bazi: bazi.year + ' ' + bazi.month + ' ' + bazi.day + ' ' + bazi.hour,
    day_master: bazi.dayMaster,
    wuxing_counts: wx.counts,
    strongest: wx.strongest,
    weakest: wx.weakest,
    favorable: wx.yongshan,
    constitution: reportData.constitution
  }) + '\n\nGenerate a personalized wellness summary (2-3 sentences) + one daily affirmation. Keep it concise and impactful.';
  
  var response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });
  
  var result = await response.json();
  return result.choices && result.choices[0] ? result.choices[0].message.content : null;
}
