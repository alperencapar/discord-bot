const { PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const LogId = require("../../models/channelLogId")
const guildOwnerUsernameProtection = require("../../handlers/guildOwnerUsernameProtection")
const { findRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = async (client, member, missingPermissions = []) => {
	const [oldMember, newMember] = member

	if (!missingPermissions?.includes("ManageNicknames"))
		guildOwnerUsernameProtection(newMember)

	const userAvatar = newMember.user.displayAvatarURL({
		format: "jpg",
		size: 4096,
	})

	if (
		oldMember.nickname?.toLowerCase() !== newMember.nickname?.toLowerCase()
	) {
		const embedData = {
			color: 0x0099ff,
			description: `✍${newMember.user.toString()} kullanıcı adını düzenledi`,
			author: {
				name: `${newMember.user.username}#${newMember.user.discriminator}`,
				icon_url: userAvatar,
			},
			thumbnail: {
				url: userAvatar,
			},
			fields: [
				{
					name: `Eski kullanıcı adı`,
					value: `${oldMember.nickname || oldMember.user.username}`,
					inline: true,
				},

				{
					name: "Yeni kullanıcı adı",
					value: `${newMember?.nickname || newMember.user.username}`,
					inline: true,
				},
			],
			footer: {
				text: `USER ID: ${newMember.user.id}`,
			},
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
			console.log(`Detail: \n\n\n ${error}`)
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, "nicknameUpdate.js")
		}
	}
}

module.exports.botPermissions = [
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.ManageNicknames,
]
