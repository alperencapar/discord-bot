const {
	ApplicationCommandOptionType,
	AttachmentBuilder,
	Client,
	CommandInteraction,
	PermissionFlagsBits,
	EmbedBuilder,
} = require("discord.js")

module.exports = {
	name: "duyuru",
	description: "Herkese duyuru yap(@everyone)!",
	options: [
		{
			name: "message",
			description: "Message",
			type: ApplicationCommandOptionType.String,
		},
		{
			name: "channel",
			description:
				"Channel to send message. If not provided, send message to current channel",
			type: ApplicationCommandOptionType.Channel,
			required: false,
		},
	],

	permissionsRequired: [PermissionFlagsBits.MentionEveryone],
	botPermissions: [PermissionFlagsBits.MentionEveryone],

	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			await interaction.reply("You can ran this command inside a server!")
			return
		}

		await interaction.channel.sendTyping()

		let message = interaction.options.get("message").value
		const channelID = interaction.options.get("channel")?.value

		const userAvatar = interaction.member.user.displayAvatarURL({
			format: "jpg",
			size: 4096,
		})

		const embedData = {
			color: 0x00d9ff,
			description: `📢${interaction.member.user.toString()} duyuruyor!`,
			author: {
				name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
				icon_url: userAvatar,
			},
			fields: [
				{
					name: `Duyuru:`,
					value: `${message}`,
				},
			],
		}
		const embed = new EmbedBuilder(embedData)
		embed.setTimestamp()

		try {
			const msg = {
				content: `${interaction.member.user.toString()} bir duyuru yayınladı @everyone 🚩`,
				embeds: [embed],
			}

			if (channelID && channelID != interaction.channelId) {
				let channel = await interaction.guild.channels.fetch(channelID)

				if (channel.viewable) {
					const sentMsg = await channel.send(msg)
					await sentMsg.react("👀")
					await interaction.reply(
						`Duyuru başarı ile ${channel.toString()} kanalına gönderildi`
					)
				} else {
					await interaction.reply(
						"Belirtilen kanala erişim yetkim bulunmuyor"
					)
					return
				}
			} else {
				const sentMsg = await interaction.channel.send(msg)
				await sentMsg.react("👀")
				await interaction.reply({
					content: "İşlem başarılı!",
					ephemeral: true,
				})
				return
			}
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
