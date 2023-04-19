const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "untimeout",
	description: "untimeout a user",
	options: [
		{
			name: "user",
			description: "The user to timeout(or user id)",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "reason",
			description: "Reason of untimeout",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.ModerateMembers],
	botPermissions: [PermissionFlagsBits.ModerateMembers],

	callback: async (client, interaction) => {
		const targetUserId = interaction.options.get("user").value
		const minutes = null
		const reason =
			interaction.options.get("reason")?.value || "No reason given."

		await interaction.channel.sendTyping()
		await interaction.deferReply()

		const targetUser = await interaction.guild.members.fetch(targetUserId)

		if (!targetUser) {
			await interaction.editReply("User cannot found in this server")
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
				"You can't untimeout that user, beacause user is same/higher role than you"
			)
			return
		}

		try {
			await targetUser.timeout(minutes, reason)
			await interaction.editReply(
				`Removed ${targetUser}'s timeout .\nReason: ${reason}`
			)
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
