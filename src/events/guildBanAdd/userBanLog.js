const { PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const LogId = require("../../models/channelLogId")
const { findRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { getRecords } = require("../../handlers/dbCacheHandler")

module.exports = async (client, guildBan, missingPermissions = []) => {
	try {
		if (missingPermissions?.includes("EmbedLinks")) return

		let logSettings = await getRecords(LogId, {}, "logId")
		if (!logSettings) return

		let logSetting = logSettings.find((logSetting) => {
			if (logSetting.guildId == guildBan.guild.id) {
				return logSetting
			}
		})

		if (!logSetting?.moderationLogChannelId) return

		const userAvatar = guildBan.user.displayAvatarURL({
			format: "jpg",
			size: 4096,
		})

		const embedData = {
			color: 0x0099ff,
			description: `${guildBan.user.toString()} sunucudan banlandı! 🚫`,
			author: {
				name: `${guildBan.user.username}#${guildBan.user.discriminator}`,
				icon_url: userAvatar,
			},
			thumbnail: {
				url: userAvatar,
			},
			fields: [
				{
					name: `Sebep:`,
					value: `${
						guildBan.reason
							? guildBan.reason
							: "Sebep belirtilmedi."
					}`,
				},
			],
			footer: {
				text: `USER ID: ${guildBan.user.id}`,
			},
		}

		const embed = new EmbedBuilder(embedData)
		embed.setTimestamp()

		let logChannel = await guildBan.guild.channels.fetch(
			logSetting.moderationLogChannelId
		)

		await logChannel.send({ embeds: [embed] })
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, guildBan)
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
