/**
 * 虚拟电厂 MVP - Virtual Power Plant
 * 
 * 概念：
 * - 用户投资虚拟能源产能
 * - 模拟发电/储能/需求响应收益
 * - 用 Lightning (Cashu) 支付
 */

const INDUSTRIES = {
  solar: { 
    name: '☀️ 虚拟太阳能', 
    base: 120, 
    risk: 'high',
    desc: '分布式太阳能发电'
  },
  storage: { 
    name: '🔋 虚拟储能', 
    base: 105, 
    risk: 'medium',
    desc: '电池储能调峰'
  },
  demand: { 
    name: '⚡ 虚拟需求响应', 
    base: 102, 
    risk: 'low',
    desc: '智能负载调度'
  },
  carbon: { 
    name: '🌱 虚拟碳信用', 
    base: 108, 
    risk: 'medium',
    desc: '碳排放权交易'
  }
};

// 模拟市场波动
function getIndex(industry) {
  const base = INDUSTRIES[industry].base;
  // 模拟真实能源市场价格波动
  const hour = new Date().getHours();
  const timeFactor = Math.sin(hour / 24 * Math.PI) * 5; // 随时间波动
  const randomFactor = (Math.random() - 0.5) * 8;
  return (base + timeFactor + randomFactor).toFixed(2);
}

// 计算投资价值
function calculateValue(sats, industry) {
  const currentIndex = getIndex(industry);
  const baseIndex = INDUSTRIES[industry].base;
  // 价值 = 投资额 * (当前指数 / 基准指数)
  return (sats * (currentIndex / baseIndex)).toFixed(0);
}

// 模拟发电收益
function simulateGeneration(industry, hours = 24) {
  const outputs = {
    solar: 3.5,    // kW 平均
    storage: 2.0,  // kW 放点
    demand: 1.5,   // kW 调度
    carbon: 0.5    // tons
  };
  
  const price = {
    solar: 0.12,   // $/kWh
    storage: 0.08,
    demand: 0.15,
    carbon: 50     // $/ton
  };
  
  const kwh = outputs[industry] * hours;
  const revenue = kwh * price[industry];
  
  return { kwh: kwh.toFixed(2), revenue: revenue.toFixed(2) };
}

// 投资组合建议
function getPortfolioSuggestion(riskTolerance = 'medium') {
  const allocations = {
    low: { solar: 20, storage: 40, demand: 30, carbon: 10 },
    medium: { solar: 40, storage: 25, demand: 20, carbon: 15 },
    high: { solar: 60, storage: 15, demand: 10, carbon: 15 }
  };
  
  return allocations[riskTolerance] || allocations.medium;
}

module.exports = {
  INDUSTRIES,
  getIndex,
  calculateValue,
  simulateGeneration,
  getPortfolioSuggestion
};
