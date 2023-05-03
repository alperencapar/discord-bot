const { PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const LogId = require("../../models/channelLogId")
const guildOwnerUsernameProtection = require("../../handlers/guildOwnerUsernameProtection")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { getRecords } = require("../../handlers/dbCacheHandler")

module.exports = async (client, member, missingPermissions = []) => {
	const [oldMember, newMember] = member

	try {
		if (!missingPermissions?.includes("ManageNicknames"))
			guildOwnerUsernameProtection(newMember)

		if (
			oldMember.communicationDisabledUntilTimestamp ||
			newMember.communicationDisabledUntilTimestamp
		) {
			if (missingPermissions.includes("EmbedLinks")) return

			let logSettings = await getRecords(LogId, {}, "logId")
			if (!logSettings) return

			let logSetting = logSettings.find((logSetting) => {
				if (logSetting.guildId == newMember.guild.id) {
					return logSetting
				}
			})

			if (!logSetting && !logSetting?.moderationLogChannelId) return

			let embedData
			const userAvatar = newMember.user.displayAvatarURL({
				format: "jpg",
				size: 4096,
			})

			if (newMember.communicationDisabledUntilTimestamp) {
				const timeoutUntil = new Date(
					newMember.communicationDisabledUntilTimestamp
				).toLocaleString("tr-tr", {
					timeZone: "Turkey",
				})

				embedData = {
					color: 0x0099ff,
					description: `⏳${newMember.user.toString()} zamanaşımına uğradı⏳`,
					author: {
						name: `${newMember.user.username}#${newMember.user.discriminator}`,
						icon_url: userAvatar,
					},
					thumbnail: {
						url: userAvatar,
					},
					fields: [
						{
							name: `Zamanaşımı bitiş:`,
							value: `${timeoutUntil}`,
							inline: true,
						},
					],
					footer: {
						text: `USER ID: ${newMember.user.id}`,
					},
				}
			}

			if (
				oldMember.communicationDisabledUntilTimestamp &&
				newMember.communicationDisabledUntilTimestamp === null
			) {
				const timeoutUntil = new Date(
					oldMember.communicationDisabledUntilTimestamp
				).toLocaleString("tr-tr", {
					timeZone: "Turkey",
				})

				embedData = {
					color: 0x0099ff,
					description: `⏳${newMember.user.toString()} zamanaşımı kaldırıldı⏳`,
					author: {
						name: `${newMember.user.username}#${newMember.user.discriminator}`,
						icon_url: userAvatar,
					},
					thumbnail: {
						url: userAvatar,
					},
					fields: [
						{
							name: `Eski zamanaşımı bitiş:`,
							value: `${timeoutUntil}`,
							inline: true,
						},
					],
					footer: {
						text: `USER ID: ${newMember.user.id}`,
					},
				}
			}

			const embed = new EmbedBuilder(embedData)
			embed.setTimestamp()

			let logChannel = await newMember.guild.channels.fetch(
				logSetting.moderationLogChannelId
			)

			await logChannel.send({ embeds: [embed] })
		}
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "timeoutUpdate.js")
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
