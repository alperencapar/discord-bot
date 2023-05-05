const {
	PermissionFlagsBits,
	EmbedBuilder,
	GuildMember,
	Client,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const { findRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { getRecords } = require("../../handlers/dbCacheHandler")

module.exports = async (client, member, missingPermissions = []) => {
	const [oldMember, newMember] = member

	if (JSON.stringify(oldMember._roles) !== JSON.stringify(newMember._roles)) {
		try {
			if (missingPermissions.includes("EmbedLinks")) return

			let logSettings = await getRecords(LogId, {}, "logId")
			if (!logSettings) return

			let logSetting = logSettings.find((logSetting) => {
				if (logSetting.guildId == newMember.guild.id) {
					return logSetting
				}
			})

			if (!logSetting?.moderationLogChannelId) return

			const userAvatar = newMember.user.displayAvatarURL({
				format: "jpg",
				size: 4096,
			})

			let oldRoles = oldMember._roles.map((role) => {
				return `<@&${role}>`
			})

			let newRoles = newMember._roles.map((role) => {
				return `<@&${role}>`
			})

			const embedData = {
				color: 0x0099ff,
				description: `✍🏻${newMember.user.toString()} rolü düzenlendi✍🏻`,
				author: {
					name: `${newMember.user.username}#${newMember.user.discriminator}`,
					icon_url: userAvatar,
				},
				thumbnail: {
					url: userAvatar,
				},
				fields: [
					{
						name: `Eski rol`,
						value: `${oldRoles}`,
					},

					{
						name: "Yeni rol:",
						value: `${newRoles}`,
					},
				],
				footer: {
					text: `USER ID: ${newMember.user.id}`,
				},
			}
			const embed = new EmbedBuilder(embedData)
			embed.setTimestamp()

			let logChannel = await newMember.guild.channels.fetch(
				logSetting.moderationLogChannelId
			)

			if (!missingPermissions.includes("EmbedLinks"))
				await logChannel.send({ embeds: [embed] })
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, "roleUpdate.js")
		}
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
