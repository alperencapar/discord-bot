require("dotenv").config();
const {
	Client,
	Events,
	GatewayIntentBits,
	Partials,
	EmbedBuilder,
	AttachmentBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
} = require("discord.js");

// Create a new client instance
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

const roles = [
    {
		id: "427758753757134850",
		label: "Yeni Üye"
	},
    {
		id: "279338064617144320",
		label: "Yerli Üye"
	},
]

client.on("ready", async (c) => {
    console.log(`✅ ${c.user.tag} is online`)
	try {
		const channel = await client.channels.cache.get("279330138167181322")
		if(!channel) return;

		const row = new ActionRowBuilder()
		roles.map(role => {
			row.components.push(
				new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
			)
		})

		await channel.send({
			content: "Rol almak ya da rol kaldırmak için butona tıklayabilirsin",
			components: [row]
		})
		process.exit()
	} catch (error) {
		console.log(error)
	}

})

/*
client.on(Events.InteractionCreate, async (interaction) => {
	console.log(interaction)
	try {
		const channel = await client.channels.cache.get(interaction.channelId)
		if(!channel) return;

		const row = new ActionRowBuilder()
		roles.map(role => {
			row.components.push(
				new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
			)
		})

		await channel.send({
			content: "Rolleri al ya da rol kaldır",
			components: [row]
		})
		process.exit()
	} catch (error) {
		console.log(error)
	}
})
*/


client.login(process.env.TOKEN);
