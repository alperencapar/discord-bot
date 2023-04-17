const {
	PermissionFlagsBits,
	EmbedBuilder,
	GuildMember,
	Client,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const guildOwnerUsernameProtection = require("../../handlers/guildOwnerUsernameProtection")
const { findRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member, missingPermissions = []) => {
	const [oldMember, newMember] = member

	if (!missingPermissions?.includes("ManageNicknames"))
		guildOwnerUsernameProtection(newMember)

	const userAvatar = newMember.user.displayAvatarURL({
		format: "jpg",
		size: 4096,
	})

	if (
		oldMember.communicationDisabledUntilTimestamp ||
		newMember.communicationDisabledUntilTimestamp
	) {
		let embedData
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

		try {
			let logSettings = await findRecord(LogId, {
				guildId: newMember.guild.id,
			})

			if (logSettings?.moderationLogChannelId) {
				let logChannel = await newMember.guild.channels.fetch(
					logSettings.moderationLogChannelId
				)

				if (!missingPermissions?.includes("EmbedLinks"))
					await logChannel.send({ embeds: [embed] })
			}
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, "timeoutUpdate.js")
		}
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
