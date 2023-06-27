const WebSocket = require('ws');
const fetch = require('node-fetch');

class Pisscord {
  constructor(token, applicationId) {
    this.token = token;
    this.applicationId = applicationId;
    this.gatewayUrl = 'wss://gateway.discord.gg/?v=10&encoding=json';
    this.ws = null;
    this.eventHandlers = {};
    this.commands = new Map();
  }

  login() {
    this.ws = new WebSocket(this.gatewayUrl);

    this.ws.on('open', () => {
      this.sendIdentifyPayload();
    });

    this.ws.on('close', (code) => {
      console.log(`Disconnected from the Discord Gateway (code: ${code})`);
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.ws.on('message', (message) => {
      try {
        const payload = JSON.parse(message);

        switch (payload.op) {
          case 10:
            this.startHeartbeat(payload.d.heartbeat_interval);
            break;
          case 11:
            //console.log('Received heartbeat ACK from the gateway');
            break;
          case 0:
            this.handleDispatchPayload(payload);
            break;
        }
      } catch (error) {
        console.error('Error while parsing the message:', error);
      }
    });
  }

  sendIdentifyPayload() {
    const payload = {
      op: 2,
      d: {
        token: this.token,
        intents: 3276799,
        properties: {
          $os: 'linux',
          $browser: 'pisscord',
          $device: 'pisscord',
        },
      },
    };

    this.ws.send(JSON.stringify(payload), (error) => {
      if (error) {
        console.error('Error while sending the identify payload:', error);
      }
    });
  }

  startHeartbeat(interval) {
    // console.log('Starting heartbeat interval');

    setInterval(() => {
      const payload = {
        op: 1,
        d: null,
      };

      this.ws.send(JSON.stringify(payload), (error) => {
        if (error) {
          //console.error('Error while sending heartbeat to the gateway:', error);
        } else {
          // console.log('Sent heartbeat to the gateway');
        }
      });
    }, interval);
  }

  handleDispatchPayload(payload) {
    const { t, d } = payload;

    if (t === 'INTERACTION_CREATE') {
      const { name } = d.data;
      const commandHandler = this.commands.get(name);

      if (commandHandler) {
        const message = {
          ...d,
          reply: (content, embed) => this.replyToInteraction(d, content, embed),
          react: (reaction) => this.reactToInteraction(d, reaction),
        };

        commandHandler(message);
      }
    } else if (t === 'MESSAGE_CREATE') {
      const messageHandler = this.eventHandlers[t];

      if (messageHandler) {
        const message = {
          ...d,
          reply: (content, embed) => this.replyMessage(d, content, embed),
          react: (reaction) => this.reactToMessage(d, reaction),
        };

        messageHandler(message);
      }
    } else {
      if (this.eventHandlers[t]) {
        this.eventHandlers[t](d);
      }
    }
  }


  on(eventType, handler) {
    this.eventHandlers[eventType] = handler;
  }

  async sendMessage(channelId, content) {
    const endpoint = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const payload = {
      content,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Failed to send message:', response.status, response.statusText);
        return;
      }

      console.log('Sent message successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  async reply(message, content, embed) {
    const endpoint = `https://discord.com/api/v10/channels/${message.channel_id}/messages`;
    const payload = {
      content,
      message_reference: {
        message_id: message.id,
        channel_id: message.channel_id
      },
    };

    if (embed) {
      payload.embeds = [embed];
    }

    if (message.guild_id) {
      payload.message_reference.guild_id = message.guild_id
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Failed to send reply:', response.status, response.statusText);
        return;
      }

      console.log('Sent reply successfully');
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  }

  async sendEmbed(channelId, embed) {
    const endpoint = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const payload = {
      embeds: [embed],
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Failed to send embed:', response.status, response.statusText);
        return;
      }

      console.log('Sent embed successfully');
    } catch (error) {
      console.error('Failed to send embed:', error);
    }
  }

  async setStatus(status, type, message) {
    const payload = {
      op: 3,
      d: {
        since: null,
        game: {
          name: message,
          type: type,
        },
        status: status,
        afk: false,
      },
    };

    try {
      this.ws.send(JSON.stringify(payload));
      console.log('Bot status updated successfully');
    } catch (error) {
      console.error('Failed to set bot status:', error);
    }
  }

  async registerCommand(name, description, options, handler) {
    const url = `https://discord.com/api/v10/applications/${this.applicationId}/commands`;

    const json = {
      name,
      description,
      options: [options],
    };

    const headers = {
      Authorization: `Bot ${this.token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(json),
      });

      if (!response.ok) {
        console.error('Failed to create global command:', response.status, response.statusText);
        return;
      }

      console.log('Global command created successfully');

      this.commands.set(name, handler);
    } catch (error) {
      console.error('Failed to create global command:', error);
    }
  }

  async deleteAllCommands() {
    const url = `https://discord.com/api/v10/applications/${this.applicationId}/commands`;

    const headers = {
      Authorization: `Bot ${this.token}`,
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        console.error('Failed to fetch commands for deletion:', response.status, response.statusText);
        return;
      }

      const commands = await response.json();

      if (!Array.isArray(commands)) {
        console.error('Invalid response while fetching commands for deletion:', commands);
        return;
      }

      const deletionPromises = commands.map(async (command) => {
        const deleteUrl = `https://discord.com/api/v10/applications/${this.applicationId}/commands/${command.id}`;

        const deleteResponse = await fetch(deleteUrl, {
          method: 'DELETE',
          headers,
        });

        if (!deleteResponse.ok) {
          console.error('Failed to delete command:', command.name, deleteResponse.status, deleteResponse.statusText);
          return;
        }

        console.log('Command deleted:', command.name);
      });

      await Promise.all(deletionPromises);

      console.log('All registered commands deleted successfully');
    } catch (error) {
      console.error('Failed to delete all registered commands:', error);
    }
  }

  async replyMessage(message, content, embed) {
    const endpoint = `https://discord.com/api/v10/channels/${message.channel_id}/messages`;
    const payload = {
      content,
      message_reference: {
        message_id: message.id,
        channel_id: message.channel_id,
      },
    };

    if (embed) {
      payload.embeds = [embed];
    }

    if (content) {
      payload[0] = content
    } else {
      payload[0] = null
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log((await response.json()).errors.message_reference._errors)
      console.log(payload)

      if (!response.ok) {
        console.error('Failed to send reply:', response.status, response.statusText);
        return;
      }
      console.log('Sent reply successfully');
    } catch (error) {
      console.log((await response.json()).errors.message_reference._errors)
      console.log(payload)
      console.error('Failed to send reply:', error);
    }
  }

  async replyToInteraction(interaction, content, embed) {
    const endpoint = `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`;
    const payload = {
      type: 4,
      data: {
        content: content !== undefined ? content : null,
        embeds: embed !== undefined ? [embed] : null,
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${this.token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Failed to send reply:', response.status, response.statusText);
        return null;
      }

      console.log('Sent reply successfully');
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  }




  async reactToInteraction(message, reaction) {
    const endpoint = `https://discord.com/api/v10/interactions/${message.id}/${message.token}/callback`;

    try {
      await fetch(`${endpoint}/messages/@original/reactions/${encodeURIComponent(reaction)}/@me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${this.token}`,
        },
      });

      console.log('Reacted to the interaction successfully');
    } catch (error) {
      console.error('Failed to react to the interaction:', error);
    }
  }

  async reactToMessage(message, reaction) {
    const endpoint = `https://discord.com/api/v10/channels/${message.channel_id}/messages/${message.id}/`;

    try {
      await fetch(`${endpoint}reactions/${encodeURIComponent(reaction)}/@me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${this.token}`,
        },
      });

      console.log('Reacted to the interaction successfully');
    } catch (error) {
      console.error('Failed to react to the interaction:', error);
    }
  }

}

module.exports = { Pisscord };
