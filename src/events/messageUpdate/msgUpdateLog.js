const {
	PermissionFlagsBits,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const { findRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = async (client, message, missingPermissions = []) => {
	const [oldMsg, newMsg] = message

	if (newMsg.author.bot || oldMsg.content == newMsg.content) return

	try {
		const guild = await client.guilds.fetch(newMsg.guildId)

		const messageChannel = await guild.channels.fetch(newMsg.channelId)

		const userAvatar = newMsg.author.displayAvatarURL({
			format: "jpg",
			size: 4096,
		})

		const embedData = {
			color: 0x0099ff,
			description: `✍🏻Mesaj düzenlendi✍🏻`,
			author: {
				name: `${newMsg.author.username}#${newMsg.author.discriminator}`,
				icon_url: userAvatar,
			},
			fields: [
				{
					name: `Orijinal mesaj:`,
					value: `${oldMsg.content}`,
				},
				{
					name: `Düzenlenen mesaj:`,
					value: `${newMsg.content}`,
				},
				{
					name: "Mesajın gönderildiği kanal:",
					value: `${messageChannel.toString()}`,
				},
				{
					name: "Mesaj ID:",
					value: `${newMsg.id}`,
				},
			],
			footer: {
				text: `USER ID: ${newMsg.author.id}`,
			},
		}
		const embed = new EmbedBuilder(embedData)
		embed.setTimestamp()

		const msg = await messageChannel.messages.fetch(newMsg.id)

		const button = new ButtonBuilder()
			.setLabel("Mesaja gitmek için tıkla")
			.setStyle(ButtonStyle.Link)
			.setURL(msg.url)

		let logSettings = await findRecord(LogId, {
			guildId: newMsg.guildId,
		})

		if (logSettings?.moderationLogChannelId) {
			const guild = await client.guilds.fetch(newMsg.guildId)
			let logChannel = await guild.channels.fetch(
				logSettings.moderationLogChannelId
			)

			if (!missingPermissions?.includes("EmbedLinks")) {
				await logChannel.send({
					embeds: [embed],
					components: [new ActionRowBuilder().addComponents(button)],
				})
			}
		}
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, message)
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
