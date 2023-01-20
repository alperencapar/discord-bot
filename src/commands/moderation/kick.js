const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits
} = require("discord.js");

module.exports = {
	name: "kick",
	description: "kick a user from server",
	options: [
		{
			name: "user",
			description: "The user to kick(or user id)",
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: "reason",
			description: "Reason of ban",
			type: ApplicationCommandOptionType.String,
			required: false
		}
	],
	permissionRequired: [PermissionFlagsBits.KickMembers],
	botPermissions: [PermissionFlagsBits.KickMembers],

	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	callback: async (client, interaction) => {
		const targetUserId = interaction.options.get("user").value;
		const reason =
			interaction.options.get("reason")?.value || "No reason given.";

		await interaction.deferReply();

		const targetUser = await interaction.guild.members.fetch(targetUserId);

		if (!targetUser) {
			await interaction.editReply("User cannot found in this server");
			return;
		}

		if (targetUser.id === interaction.guild.ownerId) {
			await interaction.editReply("Server owner can't be banned 🧠");
			return;
		}

		//highest roles of target user, request user and bot
		const targetUserRolePosition = targetUser.roles.highest.position;
		const requestUserRolePosition =
			interaction.member.roles.highest.position;
		const botRolePosition =
			interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition) {
			await interaction.editReply(
				"You can't kick that user, beacause user is same/higher role than you"
			);
			return;
		}
		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				"I can't kick that user, beacause user is same/higher role than me"
			);
			return;
		}

		try {
			await targetUser.kick(reason);
			await interaction.editReply(
				`User, ${targetUser} kicked.\nReason: ${reason}`
			);
		} catch (error) {
			console.log(
				`Error at kick user from src/commands/moderation/kick.js.\nError: ${error}`
			);
		}
	}
};
