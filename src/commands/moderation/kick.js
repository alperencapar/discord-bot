const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	EmbedBuilder,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const { findRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "kick",
	description: "kick a user from server",
	options: [
		{
			name: "user",
			description: "The user to kick(or user id)",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "reason",
			description: "Reason of ban",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.KickMembers],
	botPermissions: [PermissionFlagsBits.KickMembers],

	callback: async (client, interaction) => {
		const targetUserId = interaction.options.get("user").value
		const reason =
			interaction.options.get("reason")?.value || "No reason given."

		await interaction.channel.sendTyping()
		await interaction.deferReply()

		const targetUser = await interaction.guild.members.fetch(targetUserId)

		if (!targetUser) {
			await interaction.editReply("User cannot found in this server")
			return
		}

		if (targetUser.id === interaction.guild.ownerId) {
			await interaction.editReply("Server owner can't be banned 🧠")
			return
		}

		if (targetUser.id == interaction.user.id) {
			await interaction.editReply({
				content: "You can't kick yourself 🧠",
				ephemeral: true,
			})
			return
		}

		//highest roles of target user, request user and bot
		const targetUserRolePosition = targetUser.roles.highest.position
		const requestUserRolePosition =
			interaction.member.roles.highest.position
		const botRolePosition =
			interaction.guild.members.me.roles.highest.position

		if (targetUserRolePosition >= requestUserRolePosition) {
			await interaction.editReply({
				content:
					"You can't kick that user, beacause user is same/higher role than you 📈",
				ephemeral: true,
			})
			return
		}
		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply({
				content:
					"I can't kick that user, beacause user is same/higher role than me 📈",
				ephemeral: true,
			})
			return
		}

		try {
			await targetUser.kick(reason)
			await interaction.editReply(
				`${targetUser} sunucudan atıldı. Sebep: ${reason}`
			)

			let logSettings = await findRecord(LogId, {
				guildId: interaction.guild.id,
			})

			if (logSettings?.moderationLogChannelId) {
				let logChannel = await interaction.guild.channels.fetch(
					logSettings.moderationLogChannelId
				)

				const userAvatar = targetUser.displayAvatarURL({
					format: "jpg",
					size: 4096,
				})

				const embedData = {
					color: 0x0099ff,
					description: `🦵${targetUser.toString()} sunucudan atıldı!🦵`,
					author: {
						name: `${targetUser.tag}`,
						icon_url: userAvatar,
					},
					thumbnail: {
						url: userAvatar,
					},
					fields: [
						{
							name: `Sebep: `,
							value: `${reason}`,
						},

						{
							name: "Banlayan yetkili: ",
							value: `${interaction.member.user.toString()}`,
						},
					],
					footer: {
						text: `Banlanan kullanıcı ID: ${targetUser.id}`,
					},
				}

				const embed = new EmbedBuilder(embedData)
				embed.setTimestamp()

				await logChannel.send({ embeds: [embed] })
			}
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
