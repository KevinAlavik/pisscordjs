# Pisscord.js
Pisscord is my simple discord library for javascript you can use it to build bots
# Getting Started
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

# Documentation
#### `login()`

The `login()` method establishes a connection to the Discord Gateway and starts the authentication process. It should be called after creating an instance of `Pisscord`.

#### `on(eventType, handler)`

The `on(eventType, handler)` method allows you to register event handlers for specific event types. When an event of the specified type occurs, the provided `handler` function will be called.

Available Event Types:
- 'READY'
- 'MESSAGE_CREATE'
- 'MESSAGE_DELETE'
- 'MESSAGE_UPDATE'
- 'CHANNEL_CREATE'
- 'CHANNEL_DELETE'
- 'CHANNEL_UPDATE'
- 'GUILD_CREATE'
- 'GUILD_DELETE'
- 'GUILD_UPDATE'
- 'GUILD_MEMBER_ADD'
- 'GUILD_MEMBER_REMOVE'
- 'GUILD_MEMBER_UPDATE'
- 'PRESENCE_UPDATE'
- 'TYPING_START'
- 'VOICE_STATE_UPDATE'

#### `sendMessage(channelId, content)`

The `sendMessage(channelId, content)` method sends a message to a specific channel identified by `channelId`.

#### `reply(message, content, embed)`

The `reply(message, content, embed)` method sends a reply to a specific message.

- `message`: The message object to which you want to reply.
- `content`: The content of the reply message.
- `embed` (optional): An embed object to include in the reply.

#### `sendEmbed(channelId, embed)`

The `sendEmbed(channelId, embed)` method sends an embed message to a specific channel identified by `channelId`.

### `setStatus(status, type, message)`

The `setStatus(status, type, message)` method sets the status of the bot.

- `status`: The status value (e.g., 'online', 'idle', 'dnd', 'invisible').
- `type`: The type of status. The values are as follows:
  - 0: Playing
  - 1: Streaming
  - 2: Listening
  - 3: Watching
- `message`: The status message to display.


## Examples
Check examples/
