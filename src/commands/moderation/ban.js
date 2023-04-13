const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	EmbedBuilder,
} = require("discord.js")
const { findRecord } = require("../../handlers/dbHandler")
const LogId = require("../../models/channelLogId")

module.exports = {
	name: "ban",
	description: "Bans a user from server",
	options: [
		{
			name: "user",
			description: "The user to ban(or user id)",
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
	permissionsRequired: [PermissionFlagsBits.BanMembers],
	botPermissions: [PermissionFlagsBits.BanMembers],

	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	callback: async (client, interaction) => {
		const targetUserId = interaction.options.get("user").value
		const reason =
			interaction.options.get("reason")?.value || "No reason given."

		await interaction.channel.sendTyping()
		await interaction.deferReply()

		const targetUser = await interaction.guild.members.fetch(targetUserId)

		if (!targetUser) {
			await interaction.editReply(
				"User cannot found in this server. Id ban feature not added yet."
			)
			return
		}

		if (targetUser.id === interaction.guild.ownerId) {
			await interaction.editReply("Server owner can't be banned 🧠")
			return
		}

		//highest roles of target user, request user and bot
		const targetUserRolePosition = targetUser.roles.highest.position
		const requestUserRolePosition =
			interaction.member.roles.highest.position
		const botRolePosition =
			interaction.guild.members.me.roles.highest.position

		if (targetUserRolePosition >= requestUserRolePosition) {
			await interaction.editReply(
				"You can't ban that user, beacause user is same/higher role than you"
			)
			return
		}
		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				"I can't ban that user, beacause user is same/higher role than me"
			)
			return
		}

		try {
			await targetUser.ban({ reason })
			await interaction.editReply(
				`${targetUser} sunucudan banlandı. Sebep: ${reason}`
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
					description: `✍${targetUser.toString()} banlandı!`,
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
						text: `İşlem gören kullanıcı ID: ${targetUser.id}`,
					},
				}

				const embed = new EmbedBuilder(embedData)
				embed.setTimestamp()

				await logChannel.send({ embeds: [embed] })
			}
		} catch (error) {
			console.log(
				`Error at banning user from src/commands/moderation/ban.js.\nError: ${error}`
			)
		}
	},
}
