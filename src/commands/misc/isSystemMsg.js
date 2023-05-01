const { ApplicationCommandOptionType } = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "check-msg",
	description: "Check message if it is system message",
	options: [
		{
			name: "message-id",
			description: "Message id",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],

	callback: async (client, interaction) => {
		try {
			const messageId = interaction.options.get("message-id").value
			const channel = interaction.channel

			await interaction.channel.sendTyping()

			const message = await channel.messages.fetch(messageId)

			const isSystem = await message.author.system

			if (isSystem) {
				interaction.reply(
					`✅Mesaj doğrulandı! Mesaj sistem mesajı, güvenebilirsiniz!`
				)
			} else {
				interaction.reply(`❌Sistem mesajı değil, güvenmeyin!❌`)
			}
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
