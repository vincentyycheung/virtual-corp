#!/bin/bash
# 每日分红 - 虚拟电厂

cd /home/admin/.openclaw/workspace/subagent/virtual-corp

# 运行分红
RESULT=$(node dividend.js)

# 发送到 Discord
echo "发送分红通知到 Discord..."
