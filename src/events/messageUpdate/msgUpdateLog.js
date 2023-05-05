const {
	PermissionFlagsBits,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { getRecords } = require("../../handlers/dbCacheHandler")

module.exports = async (client, message, missingPermissions = []) => {
	const [oldMsg, newMsg] = message

	if (newMsg.author.bot || oldMsg.content == newMsg.content) return
	if (missingPermissions.includes("EmbedLinks")) return

	try {
		let logSettings = await getRecords(LogId, {}, "logId")
		if (!logSettings) return

		let logSetting = logSettings.find((logSetting) => {
			if (logSetting.guildId == newMsg.guildId) {
				return logSetting
			}
		})

		if (!logSetting || !logSetting?.moderationLogChannelId) return

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

		let logChannel = await guild.channels.fetch(
			logSetting.moderationLogChannelId
		)

		await logChannel.send({
			embeds: [embed],
			components: [new ActionRowBuilder().addComponents(button)],
		})
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, message)
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
