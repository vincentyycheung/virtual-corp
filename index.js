/**
 * 虚拟实业 MVP - 产业链股份系统
 * 
 * 概念：
 * - 用户购买"虚拟产业链"股份
 * - 模拟产业收益分红
 * - 用 Lightning (Cashu) 支付
 */

const fs = require('fs');

// 虚拟产业链配置
const INDUSTRIES = {
  'tech': { name: '科技产业链', stocks: ['NVDA', 'AAPL', 'MSFT', 'GOOGL'], risk: 'high' },
  'energy': { name: '能源产业链', stocks: ['XOM', 'CVX', 'SHEL', 'COP'], risk: 'medium' },
  'construction': { name: '建设产业链', stocks: ['CAT', 'DE', 'VMC', 'FAST'], risk: 'medium' },
  'hvac': { name: 'HVAC/管道产业链', stocks: ['Carrier', 'Trane', 'Lennox', 'AAON'], risk: 'low' }
};

// 模拟价格波动 (简化版)
function simulatePriceChange(basePrice) {
  const change = (Math.random() - 0.5) * 0.1; // -5% to +5%
  return basePrice * (1 + change);
}

// 计算产业指数
function calculateIndustryIndex(industry) {
  const config = INDUSTRIES[industry];
  let totalValue = 0;
  
  // 模拟每只股票的价格
  const prices = config.stocks.map(s => simulatePriceChange(100 + Math.random() * 100));
  const index = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  return {
    industry: config.name,
    stocks: config.stocks,
    prices,
    index: index.toFixed(2),
    risk: config.risk,
    change: ((index - 100) / 100 * 100).toFixed(2) + '%'
  };
}

// 投资系统
const investments = {}; // user -> { industry, sats, shares }

function buyShares(user, industry, sats) {
  const price = 100; // 1 share = 100 sats initially
  const shares = sats / price;
  
  if (!investments[user]) investments[user] = [];
  
  investments[user].push({
    industry,
    sats,
    shares,
    boughtAt: Date.now(),
    price
  });
  
  return { shares, totalValue: sats };
}

function getPortfolio(user) {
  return investments[user] || [];
}

function calculateTotalValue(user) {
  const portfolio = getPortfolio(user);
  let total = 0;
  
  portfolio.forEach(inv => {
    const idx = calculateIndustryIndex(inv.industry);
    const currentValue = inv.shares * parseFloat(idx.index);
    total += currentValue;
  });
  
  return total;
}

// 模拟分红 (每天调用)
function distributeDividends() {
  const totalPool = Math.floor(Math.random() * 1000) + 100; // 100-1100 sats 模拟日收益
  
  Object.keys(investments).forEach(user => {
    const portfolio = getPortfolio(user);
    const totalShares = portfolio.reduce((sum, inv) => sum + inv.shares, 0);
    
    if (totalShares > 0) {
      const dividend = (totalPool * (portfolio[0].shares / totalShares));
      console.log(`用户 ${user} 获得分红: ${dividend.toFixed(0)} sats`);
    }
  });
  
  return totalPool;
}

module.exports = {
  INDUSTRIES,
  calculateIndustryIndex,
  buyShares,
  getPortfolio,
  calculateTotalValue,
  distributeDividends
};
