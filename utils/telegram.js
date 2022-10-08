const { Telegraf } = require('telegraf');
require('dotenv').config({ path: require('find-config')('.env') });
let bot;
if (process.env.ALLOW_TELEGRAM === 'true') {
  console.log('Telegram');
  bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
}

function postSignal(option, symbol, expiration) {
  const message = `
   *❤️ NEW SIGNAL ❤️* 
  SYMBOL: ${symbol}
  OPTION: ${option}
  EXPIRATION: ${expiration} minutes
  `;
  if (process.env.ALLOW_TELEGRAM === 'true') {
    bot.telegram.sendMessage(process.env.TELEGRAM_CHANNEL, message, {
      parse_mode: 'markdown',
    });
  }
}
function postMessage(message) {
  if (process.env.ALLOW_TELEGRAM === 'true') {
    bot.telegram.sendMessage(process.env.TELEGRAM_CHANNEL, message, {
      parse_mode: 'markdown',
    });
  }
}
if (process.env.ALLOW_TELEGRAM === 'true') {
  bot.launch();
}
module.exports = { postSignal, postMessage };
