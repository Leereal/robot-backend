const { Telegraf } = require('telegraf');
require('dotenv').config({ path: require('find-config')('.env') });
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

function postSignal(option, symbol, expiration) {
  const message = `
   *❤️ NEW SIGNAL ❤️* 
  SYMBOY: ${symbol}
  OPTION: ${option}
  EXPIRATION: ${expiration} minutes
  `;

  bot.telegram.sendMessage(process.env.TELEGRAM_CHANNEL, message, {
    parse_mode: 'markdown',
  });
}
function postMessage(message) {
  bot.telegram.sendMessage(process.env.TELEGRAM_CHANNEL, message, {
    parse_mode: 'markdown',
  });
}
bot.launch();
module.exports = { postSignal, postMessage };
