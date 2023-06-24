const WebSocket = require('ws');
const fetch = require('node-fetch');

class Pisscord {
  constructor(token) {
    this.token = token;
    this.gatewayUrl = 'wss://gateway.discord.gg/?v=10&encoding=json';
    this.ws = null;
    this.eventHandlers = {};
  }

  login() {
    this.ws = new WebSocket(this.gatewayUrl);

    this.ws.on('open', () => {
      // console.log('Connected to the Discord Gateway');
      this.sendIdentifyPayload();
    });

    this.ws.on('close', (code) => {
      // console.log(`Disconnected from the Discord Gateway (code: ${code})`);
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
            // console.log('Received heartbeat ACK from the gateway');
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
          console.error('Error while sending heartbeat to the gateway:', error);
        } else {
          // console.log('Sent heartbeat to the gateway');
        }
      });
    }, interval);
  }

  handleDispatchPayload(payload) {
    const { t, d } = payload;

    if (this.eventHandlers[t]) {
      this.eventHandlers[t](d);
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

      // console.log('Sent message successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  async reply(message, content, embed) {
    const endpoint = `https://discord.com/api/v10/channels/${message.channel_id}/messages`;
    const payload = {
      content,
      embeds: [embed],
      message_reference: {
        message_id: message.id,
        channel_id: message.channel_id,
      },
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
        console.error('Failed to send reply:', response.status, response.statusText);
        return;
      }
  
      // console.log('Sent reply successfully');
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
  
      // console.log('Sent embed successfully');
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
      // console.log('Bot status updated successfully');
    } catch (error) {
      console.error('Failed to set bot status:', error);
    }
  }
  
  
}

module.exports = Pisscord;
