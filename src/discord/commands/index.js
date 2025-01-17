import fs from 'fs';
import { Collection } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const COMMANDS = {
  CREATE_NEW: 'create-new',
  LOGIN: 'login',
  ME: 'me',
  CLUSTER: 'cluster',
  SEND: 'send',
  LOGOUT: 'logout',
  SAVE_DISCORDKEY: 'save-discordkey',
  DELETE_DISCORDKEY: 'delete-discordkey',
  GET_DISCORDKEY: 'get-discordkey',
  HELP: 'help',
  BALANCE: 'balance',
};

export const OK_WITHOUT_LOGIN_COMMANDS = [
  COMMANDS.CREATE_NEW,
  COMMANDS.LOGIN,
  COMMANDS.SAVE_DISCORDKEY,
  COMMANDS.DELETE_DISCORDKEY,
  COMMANDS.GET_DISCORDKEY,
  COMMANDS.HELP,
];

export const DM_ONLY_COMMANDS = [
  COMMANDS.CREATE_NEW,
  COMMANDS.LOGIN,
  COMMANDS.ME,
  COMMANDS.CLUSTER,
  COMMANDS.LOGOUT,
  COMMANDS.BALANCE,
];

let allCommands;

const initCommands = async (client) => {
  client.commands = new Collection();

  const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file) => file.endsWith('.js'));

  const setCommand = async (file) => {
    const command = await import(`./commands/${file}`);
    const commandModule = command.default;
    console.log(`Registering command: ${commandModule.name}`);
    client.commands.set(commandModule.name, commandModule);
  };

  await Promise.all(commandFiles.map(setCommand));
  allCommands = client.commands;
};

export default {
  initCommands,
  creationCommands: [COMMANDS.CREATE_NEW, COMMANDS.LOGIN],
  OK_WITHOUT_LOGIN_COMMANDS,
  getAllCommands: () => allCommands,
  COMMANDS,
};
