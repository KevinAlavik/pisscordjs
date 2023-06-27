const { Pisscord } = require('../src/pisscord');

const token = '';
const applicationId = ''

const client = new Pisscord(token, applicationId);

client.on('READY', (e) => {
  console.log(`${e.user.username} is loged in! (Using API Version ${e.v})`)

  const options = {
    name: "animal",
    description: "The type of animal",
    type: 3,
    required: true,
    choices: [
      {
        name: "Dog",
        value: "Dog"
      },
      {
        name: "Cat",
        value: "Cat"
      },
      {
        name: "Penguin",
        value: "Penguin"
      }
    ]
  }

  client.registerCommand('animal', 'Pick an animal!', options, async (interaction) => {

    const interactionOptions = interaction.data.options

    const test = await interaction.reply(null, {
      title: 'Animals',
      description: `You picked ${interactionOptions[0].value}`,
      color: 16713650
    });
  })
})

// Login and start the Pisscord client
client.login();
