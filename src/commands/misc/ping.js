const { Client, CommandInteraction } = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "ping",
	description: "Shows bot and user ping",
	// devOnly: Boolean,
	// testOnly: Boolean,
	// deleted: Boolean,
	// options:

	callback: async (client, interaction) => {
		try {
			await interaction.channel.sendTyping()
			await interaction.deferReply()
			const reply = await interaction.fetchReply()
			const ping = reply.createdTimestamp - interaction.createdTimestamp

			await interaction.editReply(
				`Bot Ping: ${ping}ms. | Websocket: ${client.ws.ping}ms`
			)
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
