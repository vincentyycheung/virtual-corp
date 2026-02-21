/**
 * 虚拟电厂 API - 支持 Lightning 支付
 */

const INDUSTRIES = {
  solar: { name: '☀️ 虚拟太阳能', base: 120, risk: 'high' },
  storage: { name: '🔋 虚拟储能', base: 105, risk: 'medium' },
  demand: { name: '⚡ 虚拟需求响应', base: 102, risk: 'low' },
  carbon: { name: '🌱 虚拟碳信用', base: 108, risk: 'medium' }
};

// 模拟用户数据
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
  
  // 获取能源指数
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
  
  // 获取系统统计
  else if (action === 'stats') {
    const totalInvested = Object.values(investors)
      .reduce((sum, u) => sum + u.investments.reduce((s, i) => s + i.sats, 0), 0);
    
    res.json({
      success: true,
      data: {
        totalInvestors: Object.keys(investors).length,
        totalInvested,
        dailyRevenue: 45.98,
        dividendPaid: 1379
      }
    });
  }
  
  // 获取投资组合
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
      data: {
        user: username,
        portfolio,
        totalValue,
        totalInvested,
        gain: totalValue - totalInvested
      }
    });
  }
  
  // 生成支付 Invoice
  else if (action === 'invoice') {
    const amount = parseInt(sats) || 100;
    const ind = industry || 'solar';
    
    // 在服务端生成真正的 Lightning Invoice
    // 这里返回模拟数据，实际需要 NWC 配置
    res.json({
      success: true,
      data: {
        invoice: 'Demo mode - Configure NWC in Vercel env',
        amount: amount,
        industry: ind,
        message: '在 Vercel 环境变量中配置 NWC_STRING'
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
        'GET /api?action=stats - 系统统计',
        'GET /api?action=portfolio&user=xxx - 投资组合',
        'GET /api?action=invoice&sats=100&industry=solar - 生成支付'
      ]
    });
  }
};
