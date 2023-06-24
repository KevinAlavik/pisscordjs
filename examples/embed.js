const Pisscord = require('pisscordjs');

const token = '';

const bot = new Pisscord(token);

bot.on('READY', () => {
  console.log('Bot logged in');
  bot.setStatus('online', 0, 'Powered by pisscord.js');
});

const embed = {
    title: 'pisscord',
    description: 'This is an example script for pisscord.js',
    color: 16713650
  };

bot.on('MESSAGE_CREATE', (message) => {
  if (message.content === "!ping") {
    bot.reply(message, "", embed);
  }
});

bot.login();
