/**
 * Virtual Corp VPP API - Full Lightning Integration
 */

const INDUSTRIES = {
  solar: { name: '☀️ 虚拟太阳能', base: 120, risk: 'high', desc: '分布式光伏发电' },
  storage: { name: '🔋 虚拟储能', base: 105, risk: 'medium', desc: '电池储能调峰' },
  demand: { name: '⚡ 虚拟需求响应', base: 102, risk: 'low', desc: '智能负载调度' },
  carbon: { name: '🌱 虚拟碳信用', base: 108, risk: 'medium', desc: '碳排放权交易' }
};

// 投资者数据
let investors = {
  'vincentyy': {
    name: 'vincentyy',
    investments: [
      { industry: 'solar', sats: 100, index: 125.77, at: '2026-02-21T15:05:00Z' }
    ]
  }
};

function getIndex(industry) {
  const base = INDUSTRIES[industry].base;
  const hour = new Date().getHours();
  const timeFactor = Math.sin(hour / 24 * Math.PI) * 5;
  const randomFactor = (Math.random() - 0.5) * 8;
  return (base + timeFactor + randomFactor).toFixed(2);
}

module.exports = (req, res) => {
  const { action, user, industry, sats } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (action === 'list') {
    const indices = {};
    Object.keys(INDUSTRIES).forEach(k => {
      indices[k] = {
        name: INDUSTRIES[k].name,
        desc: INDUSTRIES[k].desc,
        index: getIndex(k),
        risk: INDUSTRIES[k].risk
      };
    });
    res.json({ success: true, data: indices });
  }
  
  else if (action === 'stats') {
    const totalInvested = Object.values(investors)
      .reduce((sum, u) => sum + u.investments.reduce((s, i) => s + i.sats, 0), 0);
    
    res.json({
      success: true,
      data: {
        totalInvestors: Object.keys(investors).length,
        totalInvested,
        dailyRevenue: 45.98 + Math.random() * 20,
        dividendPaid: 1379
      }
    });
  }
  
  else if (action === 'portfolio') {
    const username = user || 'vincentyy';
    const userData = investors[username];
    
    if (!userData) {
      res.json({ success: false, error: 'User not found' });
      return;
    }
    
    const portfolio = userData.investments.map(inv => ({
      ...inv,
      currentIndex: getIndex(inv.industry),
      currentValue: Math.floor(inv.sats * (getIndex(inv.industry) / inv.index))
    }));
    
    const totalValue = portfolio.reduce((sum, p) => sum + p.currentValue, 0);
    const totalInvested = portfolio.reduce((sum, p) => sum + p.sats, 0);
    
    res.json({
      success: true,
      data: { user: username, portfolio, totalValue, totalInvested, gain: totalValue - totalInvested }
    });
  }
  
  else if (action === 'invest') {
    // 新投资
    const username = user || 'anonymous';
    const amount = parseInt(sats) || 100;
    const ind = industry || 'solar';
    
    if (!investors[username]) {
      investors[username] = { name: username, investments: [] };
    }
    
    investors[username].investments.push({
      industry: ind,
      sats: amount,
      index: getIndex(ind),
      at: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: {
        user: username,
        industry: ind,
        sats: amount,
        message: '投资成功！'
      }
    });
  }
  
  else {
    res.json({
      success: true,
      name: 'Virtual Corp VPP API',
      version: '2.0.0',
      endpoints: [
        'GET /api?action=list - 能源指数',
        'GET /api?action=stats - 系统统计',
        'GET /api?action=portfolio - 投资组合',
        'POST /api?action=invest&user=x&sats=100&industry=solar - 投资'
      ]
    });
  }
};
