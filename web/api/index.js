/**
 * 虚拟电厂 API - Serverless Function
 */

const INDUSTRIES = {
  solar: { name: '☀️ 虚拟太阳能', base: 120, risk: 'high' },
  storage: { name: '🔋 虚拟储能', base: 105, risk: 'medium' },
  demand: { name: '⚡ 虚拟需求响应', base: 102, risk: 'low' },
  carbon: { name: '🌱 虚拟碳信用', base: 108, risk: 'medium' }
};

function getIndex(industry) {
  const base = INDUSTRIES[industry].base;
  const hour = new Date().getHours();
  const timeFactor = Math.sin(hour / 24 * Math.PI) * 5;
  const randomFactor = (Math.random() - 0.5) * 8;
  return (base + timeFactor + randomFactor).toFixed(2);
}

module.exports = (req, res) => {
  const { action } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (action === 'list') {
    const indices = {};
    Object.keys(INDUSTRIES).forEach(k => {
      indices[k] = {
        name: INDUSTRIES[k].name,
        index: getIndex(k),
        risk: INDUSTRIES[k].risk
      };
    });
    res.json({ success: true, data: indices });
  }
  
  else if (action === 'stats') {
    res.json({
      success: true,
      data: {
        totalInvestors: 1,
        totalInvested: 100,
        dailyRevenue: 45.98,
        dividendPaid: 1379
      }
    });
  }
  
  else {
    res.json({
      success: true,
      name: 'Virtual Corp VPP API',
      version: '1.0.0',
      endpoints: [
        'GET /api?action=list - 能源指数',
        'GET /api?action=stats - 系统统计'
      ]
    });
  }
};
