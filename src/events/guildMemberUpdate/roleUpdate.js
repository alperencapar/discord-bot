const {
	PermissionFlagsBits,
	EmbedBuilder,
	GuildMember,
	Client,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const { findRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = async (client, member, missingPermissions = []) => {
	const [oldMember, newMember] = member
	const bot = newMember.guild.members.me

	const userAvatar = newMember.user.displayAvatarURL({
		format: "jpg",
		size: 4096,
	})

	if (JSON.stringify(oldMember._roles) !== JSON.stringify(newMember._roles)) {
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

		try {
			let logSettings = await findRecord(LogId, {
				guildId: newMember.guild.id,
			})

			if (logSettings && logSettings?.moderationLogChannelId) {
				let logChannel = await newMember.guild.channels.fetch(
					logSettings.moderationLogChannelId
				)

				if (!missingPermissions?.includes("EmbedLinks"))
					await logChannel.send({ embeds: [embed] })
			}
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, "roleUpdate.js")
		}
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
