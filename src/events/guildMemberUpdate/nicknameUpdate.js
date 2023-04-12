const {
	PermissionFlagsBits,
	EmbedBuilder,
	GuildMember,
	Client,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const guildOwnerUsernameProtection = require("../../handlers/guildOwnerUsernameProtection")
const {
	userHasPermission,
	checkMissingPermission,
} = require("../../handlers/eventPermissionHandler")
const { findRecord } = require("../../handlers/dbHandler")

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
	const [oldMember, newMember] = member
	const bot = newMember.guild.members.me
	const neededPermissions = [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.EmbedLinks,
	]

	const missingPermissions = await checkMissingPermission(
		bot,
		neededPermissions
	)

	let isBotHasPermission = await userHasPermission(bot, neededPermissions)

	// console.log(missingPermissions)

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

				await logChannel.send({ embeds: [embed] })
			}
		} catch (error) {
			console.log("Error at nickname protection")
			console.log(`Detail: \n\n\n ${error}`)
		}
	}
}
