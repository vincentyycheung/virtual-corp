/**
 * 支付监控 - 检测 Lightning 支付到账
 */

const { NostrWebLNProvider } = require('@getalby/sdk');
const fs = require('fs');
const path = require('path');

// 读取配置
const envContent = fs.readFileSync('/home/admin/.openclaw/.env', 'utf8');
let ns = '', sk = '';
envContent.split('\n').forEach(l => { 
  if(l.startsWith('NWC_STRING=')){ 
    ns = l.substring(11).trim(); 
    const m = ns.match(/secret=([^&\s]+)/); 
    if(m) sk = m[1]; 
  }
});

const INVESTORS_FILE = path.join(__dirname, 'investors.json');

// 当前余额记录
const LAST_BALANCE_FILE = path.join(__dirname, '.last-balance');

async function checkPayment() {
  const nwc = new NostrWebLNProvider({ nostrWalletConnectUrl: ns, secretKey: sk });
  await nwc.enable();
  
  const bal = await nwc.getBalance();
  const currentBalance = Math.floor(bal.balance / 1000);
  
  console.log(`💰 当前余额: ${currentBalance} sats`);
  
  // 读取上次余额
  let lastBalance = 0;
  try {
    lastBalance = parseInt(fs.readFileSync(LAST_BALANCE_FILE, 'utf8'));
  } catch {}
  
  // 检测新支付
  const newSats = currentBalance - lastBalance;
  
  if (newSats > 0) {
    console.log(`\n✅ 检测到新支付: +${newSats} sats!`);
    
    // 记录新投资
    const investors = JSON.parse(fs.readFileSync(INVESTORS_FILE, 'utf8'));
    
    if (!investors.pending) investors.pending = [];
    investors.pending.push({
      sats: newSats,
      industry: 'solar', // 默认太阳能
      at: new Date().toISOString(),
      status: 'pending'
    });
    
    fs.writeFileSync(INVESTORS_FILE, JSON.stringify(investors, null, 2));
    console.log(`📝 已添加到待处理投资`);
  } else {
    console.log('没有新支付');
  }
  
  // 保存当前余额
  fs.writeFileSync(LAST_BALANCE_FILE, currentBalance.toString());
  
  return newSats;
}

checkPayment().catch(e => console.log('❌', e.message));
