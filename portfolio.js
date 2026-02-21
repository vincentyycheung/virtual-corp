/**
 * 投资组合查询
 */

const fs = require('fs');
const data = JSON.parse(fs.readFileSync(__dirname + '/investors.json', 'utf8'));

const INDUSTRIES = {
  solar: { name: '☀️ 虚拟太阳能', base: 120 },
  storage: { name: '🔋 虚拟储能', base: 105 },
  demand: { name: '⚡ 虚拟需求响应', base: 102 },
  carbon: { name: '🌱 虚拟碳信用', base: 108 }
};

function getCurrentIndex(industry) {
  const base = INDUSTRIES[industry].base;
  const hour = new Date().getHours();
  const timeFactor = Math.sin(hour / 24 * Math.PI) * 5;
  const randomFactor = (Math.random() - 0.5) * 8;
  return (base + timeFactor + randomFactor).toFixed(2);
}

console.log('\n💼 投资组合\n');
console.log('══════════════════════════════\n');

Object.values(data.investors).forEach(user => {
  console.log(`投资者: ${user.name}`);
  console.log('────────────────────────────────');
  
  let totalValue = 0;
  
  user.investments.forEach(inv => {
    const currentIndex = getCurrentIndex(inv.industry);
    const currentValue = Math.floor(inv.sats * (currentIndex / inv.index));
    const gain = currentValue - inv.sats;
    const gainPct = ((gain / inv.sats) * 100).toFixed(1);
    
    console.log(`\n${INDUSTRIES[inv.industry].name}`);
    console.log(`  投资额: ${inv.sats} sats`);
    console.log(`  买入指数: ${inv.index}`);
    console.log(`  当前指数: ${currentIndex}`);
    console.log(`  当前价值: ${currentValue} sats`);
    console.log(`  ${gain >= 0 ? '📈' : '📉'} 收益: ${gain >= 0 ? '+' : ''}${gain} sats (${gainPct}%)`);
    
    totalValue += currentValue;
  });
  
  console.log('\n────────────────────────────────');
  console.log(`总投资: ${user.investments.reduce((s, i) => s + i.sats, 0)} sats`);
  console.log(`总价值: ${totalValue} sats`);
  console.log(`总收益: ${totalValue - data.totalInvested} sats`);
  console.log('\n');
});
