/**
 * 代币化投资凭证系统
 * 
 * 投资凭证 NFT 化
 */

const TOKENS = {};
let TOKEN_ID = 1000;

function mintToken(user, investment) {
  const tokenId = 'VPP-' + (TOKEN_ID++);
  
  TOKENS[tokenId] = {
    id: tokenId,
    owner: user,
    industry: investment.industry,
    amount: investment.sats,
    purchaseIndex: investment.index,
    issuedAt: new Date().toISOString(),
    type: 'energy-bond'
  };
  
  return TOKENS[tokenId];
}

function getUserTokens(user) {
  return Object.values(TOKENS).filter(t => t.owner === user);
}

module.exports = (req, res) => {
  const { action, user, tokenId, industry, sats } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (action === 'mint') {
    // 铸造新代币
    const investment = {
      industry: industry || 'solar',
      sats: parseInt(sats) || 100,
      index: 100 + Math.random() * 50
    };
    
    const token = mintToken(user || 'anonymous', investment);
    
    res.json({
      success: true,
      data: {
        message: '代币铸造成功！',
        token: token
      }
    });
  }
  
  else if (action === 'balance') {
    // 查询用户代币
    const tokens = getUserTokens(user || 'anonymous');
    
    res.json({
      success: true,
      data: {
        user: user || 'anonymous',
        tokens: tokens,
        totalValue: tokens.reduce((sum, t) => sum + t.amount, 0)
      }
    });
  }
  
  else if (action === 'list') {
    // 所有代币列表
    res.json({
      success: true,
      data: Object.values(TOKENS)
    });
  }
  
  else {
    res.json({
      success: true,
      message: '代币化凭证系统 API',
      endpoints: [
        '?action=mint&user=x&sats=100&industry=solar - 铸造代币',
        '?action=balance&user=x - 查询余额',
        '?action=list - 所有代币'
      ]
    });
  }
};
