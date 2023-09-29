import { WebSocket } from 'ws';
import fetch from 'node-fetch';

declare class Pisscord {
  constructor(token: string, applicationId: string);

  login(): void;

  sendIdentifyPayload(): void;

  startHeartbeat(interval: number): void;

  handleDispatchPayload(payload: any): void;

  on(eventType: string, handler: Function): void;

  sendMessage(channelId: string, content: string): Promise<void>;

  reply(message: any, content: string, embed: any): Promise<void>;

  sendEmbed(channelId: string, embed: any): Promise<void>;

  setStatus(status: string, type: number, message: string): Promise<void>;

  registerCommand(name: string, description: string, options: any, handler: Function): Promise<void>;

  deleteAllCommands(): Promise<void>;

  replyMessage(message: any, content: string, embed: any): Promise<void>;

  replyToInteraction(interaction: any, content: string, embed: any): Promise<void>;

  reactToInteraction(message: any, reaction: string): Promise<void>;

  reactToMessage(message: any, reaction: string): Promise<void>;
}

export = Pisscord;
