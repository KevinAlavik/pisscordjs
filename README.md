# Pisscord.js
Pisscord is my simple discord library for javascript you can use it to build bots
## Installing
## Getting Started
Its pretty simple start by going to [discords developer dashbord](https://discord.com/developers/applications) and create a new application. Now create a bot and save the **token** (we will need this later). And just invite your bot to your server (im guessing you know how to)

Now create a new directory (this can be called anything. Now open this directory in your favorite code editor. We need to run two commands before getting started coding! Start by running:
```sh
npm init -y
````
then just run this to install pisscord:
```sh
npm i pisscordjs
```

Now create an index.js file and inside type this:

```js
const Pisscord = require('pisscordjs');

const token = 'YOUR_BOT_TOKEN'; // This is the token you should have saved before

const bot = new Pisscord(token);

bot.on('READY', () => {
  console.log('Bot logged in');
  bot.setStatus('online', 0, 'Powered by pisscord.js');
});

bot.on('MESSAGE_CREATE', (message) => {
  if (message.content === "!ping") {
    bot.reply(message, "Pong");
  }
});

bot.login();
```
Now just run:
```sh
node .
```
Now  go back to discord and you should see your bot online! Now try to type:
```
!ping
```
in the chat and your bot should reply with **Pong**

## Documentation
Right now we are working on documentation :)

## Examples
Check examples/
