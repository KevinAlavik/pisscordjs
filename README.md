# Pisscord.js - devonly
The devonly branch is mostly for unstable features and developer things

# Unstable Features
- Application Commands - Working
- \<message return object>.reply() - Working
- \<message return object>.react() - Broken
- Application Command Options - Working but needs improvement

# Installing
Since this branch isnt meant to  be used with npm since its not public you will need to clone this repo and get the `src/pisscord.js` and just import it in your project.

# Client
The Pisscord constructor now takes in an application id to (plus the token)

Example:

```js
new Pisscord(token, applicationId);
```

# Application Commands
Its very simple to register and use application commands/slash commands in pisscord

client.registerCommand:
```js
client.registerCommand(name, description, options, handler)
```

Example on regestring and replying to /ping:
```js
client.registerCommand('ping', 'Responds with pong', null , async (interaction) => {
  await interaction.reply("Pong");
})
```
(In this example options is null, atm you need to put null if you dont wanna have options)

## Options
Example options object:
```js
const options = {
  name: "animal",
  description: "The type of animal",
  type: 3,
  required: true,
  choices: [
    {
      name: "Dog",
      value: "animal_dog"
    },
    {
      name: "Cat",
      value: "animal_cat"
    },
    {
      name: "Penguin",
      value: "animal_penguin"
    }
  ]
}
```
(`interaction.data.options` lists all of the options the user has inputed + their value)

# \<message return object>.reply()
`message.reply(message)` is an easier way to run `client.replyMessage(messageObj, message)`

This works with interactions to


# Examples
Check examples/
