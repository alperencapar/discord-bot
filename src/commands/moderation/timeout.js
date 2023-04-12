const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js")

module.exports = {
	name: "timeout",
	description: "timeout a user",
	options: [
		{
			name: "user",
			description: "The user to timeout(or user id)",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "minutes",
			description: "Minute of timeout",
			type: ApplicationCommandOptionType.Integer,
			required: false,
		},
		{
			name: "reason",
			description: "Reason of timeout",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.ModerateMembers],
	botPermissions: [PermissionFlagsBits.ModerateMembers],

	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	callback: async (client, interaction) => {
		const targetUserId = interaction.options.get("user").value
		const minutes = interaction.options.get("minutes")?.value || 5
		const reason =
			interaction.options.get("reason")?.value || "No reason given."

		await interaction.deferReply()

		const targetUser = await interaction.guild.members.fetch(targetUserId)

		if (!targetUser) {
			await interaction.editReply("User cannot found in this server")
			return
		}

		if (targetUser.id === interaction.guild.ownerId) {
			await interaction.editReply("Server owner cannot be timed out 🧠")
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
				"You can't timeout that user, beacause user is same/higher role than you"
			)
			return
		}
		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				"I can't timeout that user, beacause user is same/higher role than me"
			)
			return
		}

		try {
			await targetUser.timeout(minutes * 60 * 1000, reason)
			await interaction.editReply(
				`${targetUser} has timeouted for ${minutes} minutes.\nReason: ${reason}`
			)
		} catch (error) {
			console.log(
				`Error at timeout user from src/commands/moderation/timeout.js.\nError: ${error}`
			)
		}
	},
}
