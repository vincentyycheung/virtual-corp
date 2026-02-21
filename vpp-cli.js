/**
 * 虚拟电厂投资系统 - VPP CLI
 */

const fs = require('fs');
const path = require('path');
const { NostrWebLNProvider } = require('@getalby/sdk');

// 读取 NWC 配置
const envContent = fs.readFileSync('/home/admin/.openclaw/.env', 'utf8');
let ns = '', sk = '';
envContent.split('\n').forEach(l => { 
  if(l.startsWith('NWC_STRING=')){ 
    ns = l.substring(11).trim(); 
    const m = ns.match(/secret=([^&\s]+)/); 
    if(m) sk = m[1]; 
  }
});

const INDUSTRIES = {
  solar: { name: '☀️ 虚拟太阳能', base: 120, risk: 'high', desc: '分布式太阳能' },
  storage: { name: '🔋 虚拟储能', base: 105, risk: 'medium', desc: '电池储能调峰' },
  demand: { name: '⚡ 虚拟需求响应', base: 102, risk: 'low', desc: '智能负载调度' },
  carbon: { name: '🌱 虚拟碳信用', base: 108, risk: 'medium', desc: '碳排放权交易' }
};

function getIndex(industry) {
  const base = INDUSTRIES[industry].base;
  const hour = new Date().getHours();
  const timeFactor = Math.sin(hour / 24 * Math.PI) * 5;
  const randomFactor = (Math.random() - 0.5) * 8;
  return (base + timeFactor + randomFactor).toFixed(2);
}

function simulateGeneration(industry) {
  const outputs = { solar: 3.5, storage: 2.0, demand: 1.5, carbon: 0.5 };
  const prices = { solar: 0.12, storage: 0.08, demand: 0.15, carbon: 50 };
  const kwh = outputs[industry] * 24;
  return { kwh: kwh.toFixed(2), revenue: (kwh * prices[industry]).toFixed(2) };
}

async function createInvoice(sats) {
  const nwc = new NostrWebLNProvider({ nostrWalletConnectUrl: ns, secretKey: sk });
  await nwc.enable();
  const inv = await nwc.makeInvoice({ amount: sats });
  return inv.paymentRequest;
}

async function getBalance() {
  try {
    const nwc = new NostrWebLNProvider({ nostrWalletConnectUrl: ns, secretKey: sk });
    await nwc.enable();
    const bal = await nwc.getBalance();
    return Math.floor(bal.balance / 1000);
  } catch { return 0; }
}

const args = process.argv.slice(2);
const cmd = args[0];

(async () => {
  
  if (cmd === 'list' || !cmd) {
    console.log('\n🏭 虚拟电厂指数\n');
    Object.keys(INDUSTRIES).forEach(k => {
      const idx = getIndex(k);
      const ind = INDUSTRIES[k];
      const gen = simulateGeneration(k);
      console.log(`${k}: ${ind.name}`);
      console.log(`   指数: ${idx} | 风险: ${ind.risk}`);
      console.log(`   24h: ${gen.kwh} kWh → $${gen.revenue}`);
      console.log('');
    });
  }
  
  else if (cmd === 'invoice') {
    const sats = parseInt(args[1]) || 100;
    const industry = args[2] || 'solar';
    
    console.log(`\n⚡ 生成 ${industry} 投资 Invoice\n`);
    console.log(`金额: ${sats} sats\n`);
    
    const inv = await createInvoice(sats);
    console.log(`📋 Invoice:\n${inv}\n`);
  }
  
  else if (cmd === 'balance') {
    const bal = await getBalance();
    console.log(`\n💰 合约余额: ${bal} sats\n`);
  }
  
  else if (cmd === 'suggest') {
    const risk = args[1] || 'medium';
    const total = parseInt(args[2]) || 1000;
    
    console.log(`\n💼 投资组合建议 (${risk}风险)\n`);
    
    const allocations = {
      low: { solar: 20, storage: 40, demand: 30, carbon: 10 },
      medium: { solar: 40, storage: 25, demand: 20, carbon: 15 },
      high: { solar: 60, storage: 15, demand: 10, carbon: 15 }
    };
    
    const alloc = allocations[risk] || allocations.medium;
    
    Object.keys(alloc).forEach(k => {
      const amount = Math.floor(total * alloc[k] / 100);
      console.log(`${k}: ${alloc[k]}% → ${amount} sats`);
    });
    console.log('');
  }
  
  else {
    console.log(`
🏭 虚拟电厂 CLI

用法:
  node vpp-cli.js list              - 查看能源指数
  node vpp-cli.js invoice <sats>   - 生成投资 Invoice
  node vpp-cli.js balance          - 查看合约余额
  node vpp-cli.js suggest <风险>   - 投资建议

风险等级: low, medium, high
能源: solar, storage, demand, carbon

示例:
  node vpp-cli.js invoice 100 solar  - 投资 100 sats 到太阳能
  node vpp-cli.js suggest medium 1000 - 1000 sats 中等风险配置
`);
  }
  
})();
