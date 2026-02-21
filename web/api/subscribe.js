/**
 * 商业化 - 付费订阅系统
 */

const PLANS = {
  free: {
    name: '免费版',
    price: 0,
    features: ['基础指数查看', '模拟投资'],
    limit: '100 sats/天'
  },
  pro: {
    name: '专业版',
    price: 1000,
    currency: 'sats',
    features: ['实时市场数据', '高级分析', '优先分红', '无限投资'],
    period: '30天'
  },
  enterprise: {
    name: '企业版',
    price: 5000,
    currency: 'sats',
    features: ['API访问', '定制策略', '专属客服', '白标合作'],
    period: '30天'
  }
};

const SUBSCRIPTIONS = {};

module.exports = (req, res) => {
  const { action, user, plan } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (action === 'plans') {
    res.json({ success: true, data: PLANS });
  }
  
  else if (action === 'subscribe') {
    const planData = PLANS[plan] || PLANS.free;
    
    if (!SUBSCRIPTIONS[user]) SUBSCRIPTIONS[user] = {};
    SUBSCRIPTIONS[user] = {
      plan: plan,
      subscribedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString()
    };
    
    res.json({
      success: true,
      data: {
        message: `订阅${planData.name}成功！`,
        subscription: SUBSCRIPTIONS[user]
      }
    });
  }
  
  else if (action === 'status') {
    const sub = SUBSCRIPTIONS[user] || { plan: 'free' };
    res.json({ success: true, data: { user, ...sub } });
  }
  
  else {
    res.json({ success: true, message: '订阅系统 API', endpoints: ['?action=plans', '?action=subscribe&plan=pro', '?action=status&user=x'] });
  }
};
