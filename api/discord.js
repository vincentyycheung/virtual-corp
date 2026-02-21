/**
 * Discord 社区集成
 */

const INVITES = {};
let INVITE_ID = 1;

function generateInvite(user) {
  const code = 'VPP-' + (INVITE_ID++);
  INVITES[code] = {
    code,
    inviter: user,
    createdAt: new Date().toISOString(),
    uses: 0
  };
  return code;
}

module.exports = (req, res) => {
  const { action, user, code } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (action === 'invite') {
    const inviteCode = generateInvite(user || 'system');
    res.json({
      success: true,
      data: {
        inviteCode,
        url: `https://virtual-corp.vercel.app?ref=${inviteCode}`,
        message: '分享链接邀请好友投资'
      }
    });
  }
  
  else if (action === 'leaderboard') {
    // 模拟排行榜数据
    const leaders = [
      { rank: 1, user: 'vincentyy', investment: 100, returns: 15 },
      { rank: 2, user: 'alice', investment: 80, returns: 12 },
      { rank: 3, user: 'bob', investment: 50, returns: 8 },
      { rank: 4, user: 'charlie', investment: 30, returns: 4 },
      { rank: 5, user: 'dave', investment: 20, returns: 2 }
    ];
    
    res.json({ success: true, data: leaders });
  }
  
  else {
    res.json({
      success: true,
      message: 'Discord 社区系统',
      endpoints: [
        '?action=invite&user=x - 生成邀请',
        '?action=leaderboard - 排行榜'
      ]
    });
  }
};
