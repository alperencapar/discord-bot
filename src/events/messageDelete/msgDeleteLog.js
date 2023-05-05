const { PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const LogId = require("../../models/channelLogId")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { getRecords } = require("../../handlers/dbCacheHandler")

module.exports = async (client, message, missingPermissions = []) => {
	try {
		const msg = message?.content
		const msgUser = message?.author

		if (msgUser?.bot || !(msgUser && msg)) return

		let logSettings = await getRecords(LogId, {}, message.guildId)

		if (!logSettings) return

		let logSetting = logSettings.find((logSetting) => {
			if (logSetting.guildId == message.guildId) {
				return logSetting
			}
		})

		if (!logSetting || !logSetting?.moderationLogChannelId) return

		const messageChannel = await message.channel.fetch(message.channelId)
		const userAvatar = msgUser.displayAvatarURL({
			format: "jpg",
			size: 4096,
		})

		const embedData = {
			color: 0x0099ff,
			description: `🗑Mesaj silindi🗑`,
			author: {
				name: `${msgUser.username}#${msgUser.discriminator}`,
				icon_url: userAvatar,
			},
			fields: [
				{
					name: `Silinen Mesaj:`,
					value: `${msg}`,
				},
				{
					name: "Mesajın gönderildiği kanal:",
					value: `${messageChannel.toString()}`,
				},
				{
					name: "Mesaj ID:",
					value: `${message.id}`,
					inline: true,
				},
			],
			footer: {
				text: `USER ID: ${msgUser.id}`,
			},
		}
		const embed = new EmbedBuilder(embedData)
		embed.setTimestamp()

		const guild = await client.guilds.fetch(message.guildId)
		let logChannel = await guild.channels.fetch(
			logSetting.moderationLogChannelId
		)

		if (!missingPermissions?.includes("EmbedLinks"))
			await logChannel.send({ embeds: [embed] })
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, message)
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
