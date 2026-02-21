/**
 * 真实能源市场数据 API
 * 
 * 模拟接入电力市场价格
 */

const MARKET_DATA = {
  ontario: {
    name: 'Ontario Electricity',
    price: 0.12 + Math.random() * 0.05,
    unit: '$/kWh',
    trend: Math.random() > 0.5 ? 'up' : 'down'
  },
  alberta: {
    name: 'Alberta Power',
    price: 0.08 + Math.random() * 0.04,
    unit: '$/kWh',
    trend: Math.random() > 0.5 ? 'up' : 'down'
  },
  solar: {
    name: 'Solar Index',
    index: 100 + (Math.random() - 0.3) * 20,
    trend: 'up'
  },
  carbon: {
    name: 'Carbon Credit',
    price: 45 + Math.random() * 20,
    unit: '$/ton',
    trend: 'up'
  },
  gas: {
    name: 'Natural Gas',
    price: 2.5 + Math.random() * 0.8,
    unit: '$/MMBtu',
    trend: Math.random() > 0.5 ? 'up' : 'down'
  },
  weather: {
    name: 'Weather Factor',
    temp: 15 + Math.random() * 15,
    condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
    solarOutput: 0.7 + Math.random() * 0.3
  }
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    data: MARKET_DATA
  });
};
