const {
	ApplicationCommandOptionType,
	AttachmentBuilder,
	Client,
	CommandInteraction,
	PermissionFlagsBits,
	EmbedBuilder,
} = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "echo",
	description: "Make bot to send messages",
	options: [
		{
			name: "message",
			description: "Message",
			type: ApplicationCommandOptionType.String,
		},
	],

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @returns
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			await interaction.reply("You can ran this command inside a server!")
			return
		}

		await interaction.channel.sendTyping()

		let message = interaction.options.get("message").value

		const userAvatar = interaction.member.user.displayAvatarURL({
			format: "jpg",
			size: 4096,
		})

		const embedData = {
			color: 0x00d9ff,
			description: `🗣${interaction.member.user.toString()} diyor ki: ${message}`,
			author: {
				name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
				icon_url: userAvatar,
			},
		}

		const embed = new EmbedBuilder(embedData)
		embed.setTimestamp()

		try {
			const replied = await interaction.reply({
				embeds: [embed],
				fetchReply: true,
			})
			await replied.react("✅")
			await replied.react("❌")
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
