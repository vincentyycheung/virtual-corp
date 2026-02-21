/**
 * 每日分红系统
 * 
 * 概念：
 * - 每日从"发电收益"中拿出一定比例分红给投资者
 * - 模拟真实VPP的收入分配
 */

const fs = require('fs');
const path = require('path');

const INVESTORS_FILE = path.join(__dirname, 'investors.json');
const DIVIDEND_HISTORY = path.join(__dirname, 'dividend-history.json');

// 模拟每日发电收入 (基于真实市场数据)
function calculateDailyRevenue() {
  // 模拟不同能源的发电收益
  const revenues = {
    solar: 10 + Math.random() * 5,    // $10-15/天 (太阳能)
    storage: 3 + Math.random() * 2,   // $3-5/天 (储能)
    demand: 5 + Math.random() * 3,    // $5-8/天 (需求响应)
    carbon: 20 + Math.random() * 10   // $20-30/天 (碳信用)
  };
  
  return revenues;
}

// 分红计算
function distributeDividends() {
  const investors = JSON.parse(fs.readFileSync(INVESTORS_FILE, 'utf8'));
  const revenues = calculateDailyRevenue();
  
  // 总收入 30% 用于分红
  const totalRevenue = Object.values(revenues).reduce((a, b) => a + b, 0);
  const dividendPool = totalRevenue * 0.3; // 30% 分红
  
  console.log('\n📊 每日收益报告\n');
  console.log('────────────────────────────────');
  
  Object.keys(revenues).forEach(ind => {
    console.log(`${ind}: $${revenues[ind].toFixed(2)}`);
  });
  
  console.log('────────────────────────────────');
  console.log(`总收入: $${totalRevenue.toFixed(2)}`);
  console.log(`分红池 (30%): $${dividendPool.toFixed(2)}`);
  
  // 计算每个投资者的分红
  let totalSatsDividend = 0;
  const dividends = [];
  
  // 简单计算：按投资额比例分红
  const totalInvested = Object.values(investors.investors)
    .reduce((sum, u) => sum + u.investments.reduce((s, i) => s + i.sats, 0), 0);
  
  if (totalInvested > 0) {
    // 把美元转换为 sats (假设 1$ = 10000 sats)
    const satsPool = Math.floor(dividendPool * 100);
    
    Object.values(investors.investors).forEach(user => {
      const userInvested = user.investments.reduce((s, i) => s + i.sats, 0);
      const share = userInvested / totalInvested;
      const userDividend = Math.floor(satsPool * share);
      
      if (userDividend > 0) {
        dividends.push({
          user: user.name,
          dividend: userDividend,
          share: (share * 100).toFixed(1) + '%'
        });
        totalSatsDividend += userDividend;
      }
    });
  }
  
  console.log('\n💰 分红详情:\n');
  dividends.forEach(d => {
    console.log(`${d.user}: +${d.dividend} sats (${d.share})`);
  });
  
  console.log(`\n总分红: ${totalSatsDividend} sats\n`);
  
  // 记录历史
  const history = {
    date: new Date().toISOString().split('T')[0],
    revenue: totalRevenue,
    dividendPool,
    totalSatsDividend,
    dividends
  };
  
  let historyData = [];
  try {
    historyData = JSON.parse(fs.readFileSync(DIVIDEND_HISTORY, 'utf8'));
  } catch {}
  historyData.push(history);
  fs.writeFileSync(DIVIDEND_HISTORY, JSON.stringify(historyData, null, 2));
  
  return dividends;
}

// 运行分红
console.log('🏭 虚拟电厂 - 每日分红\n');
const dividends = distributeDividends();
