require("dotenv").config();
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");

const eventHandler = require("./src/handlers/eventHandler");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember,
		Partials.Reaction
	]
});

eventHandler(client);

client.login(process.env.TOKEN);
