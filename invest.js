/**
 * 虚拟实业 - Lightning 投资系统
 */

const { NostrWebLNProvider } = require('@getalby/sdk');
const fs = require('fs');
const path = require('path');

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
  tech: { name: '科技产业链', risk: 'high', base: 150 },
  energy: { name: '能源产业链', risk: 'medium', base: 110 },
  construction: { name: '建设产业链', risk: 'medium', base: 105 },
  hvac: { name: 'HVAC/管道产业链', risk: 'low', base: 102 }
};

const DATA_FILE = path.join(__dirname, 'investors.json');

function loadData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } 
  catch { return { investors: {}, pending: {} }; }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getIndex(industry) {
  const base = INDUSTRIES[industry].base;
  const change = (Math.random() - 0.5) * 10;
  return (base + change).toFixed(2);
}

// 生成投资 Invoice
async function createInvestmentInvoice(sats) {
  const nwc = new NostrWebLNProvider({ nostrWalletConnectUrl: ns, secretKey: sk });
  await nwc.enable();
  
  const invoice = await nwc.makeInvoice({ amount: sats });
  return invoice.paymentRequest;
}

// 查询余额
async function getBalance() {
  try {
    const nwc = new NostrWebLNProvider({ nostrWalletConnectUrl: ns, secretKey: sk });
    await nwc.enable();
    const bal = await nwc.getBalance();
    return Math.floor(bal.balance / 1000);
  } catch {
    return 0;
  }
}

// CLI
const args = process.argv.slice(2);
const cmd = args[0];

(async () => {
  
  if (cmd === 'invoice') {
    // 生成投资 invoice
    const sats = parseInt(args[1]) || 100;
    const industry = args[2] || 'hvac';
    
    console.log(`\n⚡ 生成投资 Invoice\n`);
    console.log(`产业: ${INDUSTRIES[industry].name}`);
    console.log(`金额: ${sats} sats\n`);
    
    const invoice = await createInvestmentInvoice(sats);
    console.log(`📋 Invoice:\n${invoice}\n`);
    console.log(`💡 支付此 Invoice 来完成投资！\n`);
  }
  
  else if (cmd === 'balance') {
    const bal = await getBalance();
    console.log(`\n💰 合约余额: ${bal} sats\n`);
  }
  
  else if (cmd === 'list') {
    console.log('\n🏭 虚拟产业链指数\n');
    Object.keys(INDUSTRIES).forEach(key => {
      console.log(`${key}: ${INDUSTRIES[key].name} (基准: ${INDUSTRIES[key].base}) | 风险: ${INDUSTRIES[key].risk}`);
    });
    console.log('');
  }
  
  else {
    console.log(`
🏭 虚拟实业 - Lightning 投资系统

用法:
  node invest.js list                    - 查看产业链
  node invest.js invoice <sats> <行业>  - 生成投资 Invoice
  node invest.js balance                 - 查看合约余额

示例:
  node invest.js invoice 100 hvac       - 生成 100 sats HVAC 产业投资 Invoice
`);
  }
  
})();
