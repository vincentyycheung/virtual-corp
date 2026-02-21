/**
 * 虚拟实业 CLI - MVP Demo
 */

const fs = require('fs');
const path = require('path');

const INDUSTRIES = {
  'tech': { name: '科技产业链', risk: 'high' },
  'energy': { name: '能源产业链', risk: 'medium' },
  'construction': { name: '建设产业链', risk: 'medium' },
  'hvac': { name: 'HVAC/管道产业链', risk: 'low' }
};

// 模拟价格
function getIndex(industry) {
  const bases = { tech: 150, energy: 110, construction: 105, hvac: 102 };
  const base = bases[industry] || 100;
  const change = (Math.random() - 0.5) * 10;
  return (base + change).toFixed(2);
}

// 用户数据存储
const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { users: {}, transactions: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 命令处理
const args = process.argv.slice(2);
const cmd = args[0];

const data = loadData();

if (cmd === 'list') {
  console.log('\n🏭 虚拟产业链指数\n');
  Object.keys(INDUSTRIES).forEach(key => {
    const idx = getIndex(key);
    const ind = INDUSTRIES[key];
    console.log(`${key}: ${ind.name} | 指数: ${idx} | 风险: ${ind.risk}`);
  });
  console.log('');
}

else if (cmd === 'buy') {
  const user = args[1] || 'anonymous';
  const industry = args[2];
  const sats = parseInt(args[3]);
  
  if (!INDUSTRIES[industry]) {
    console.log('可用产业: tech, energy, construction, hvac');
    process.exit(1);
  }
  
  if (!sats || sats < 10) {
    console.log('最小投资: 10 sats');
    process.exit(1);
  }
  
  // 记录投资
  if (!data.users[user]) data.users[user] = [];
  data.users[user].push({
    industry,
    sats,
    index: getIndex(industry),
    at: Date.now()
  });
  
  data.transactions.push({
    type: 'buy',
    user,
    industry,
    sats,
    at: Date.now()
  });
  
  saveData(data);
  
  console.log(`\n✅ 投资成功!`);
  console.log(`用户: ${user}`);
  console.log(`产业: ${INDUSTRIES[industry].name}`);
  console.log(`金额: ${sats} sats`);
  console.log(`当前指数: ${getIndex(industry)}\n`);
}

else if (cmd === 'portfolio') {
  const user = args[1] || 'anonymous';
  const portfolio = data.users[user] || [];
  
  console.log(`\n💼 用户 ${user} 的投资组合\n`);
  
  if (portfolio.length === 0) {
    console.log('暂无投资');
  } else {
    let total = 0;
    portfolio.forEach(inv => {
      const current = getIndex(inv.industry);
      const value = (inv.sats / parseFloat(inv.index)) * parseFloat(current);
      total += value;
      console.log(`- ${INDUSTRIES[inv.industry].name}: ${inv.sats} sats → ${value.toFixed(0)} sats (指数 ${current})`);
    });
    console.log(`\n总价值: ${total.toFixed(0)} sats`);
  }
  console.log('');
}

else if (cmd === 'stats') {
  const totalUsers = Object.keys(data.users).length;
  const totalSats = data.transactions.reduce((sum, t) => sum + (t.sats || 0), 0);
  
  console.log('\n📊 系统统计\n');
  console.log(`总用户: ${totalUsers}`);
  console.log(`总投资: ${totalSats} sats`);
  console.log(`交易数: ${data.transactions.length}`);
  console.log('');
}

else {
  console.log(`
🏭 虚拟实业 CLI

用法:
  node cli.js list                          - 查看产业链指数
  node cli.js buy <user> <industry> <sats> - 投资
  node cli.js portfolio <user>              - 查看投资组合
  node cli.js stats                         - 系统统计

示例:
  node cli.js buy alice tech 100            - Alice 投资 100 sats 到科技产业
  node cli.js portfolio alice                - 查看 Alice 的组合
`);
}
