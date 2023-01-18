const {
	Client,
	Ineraction,
	ApplicationCommandOptionType,
	PermissionFlagsBits
} = require("discord.js");

module.exports = {
	name: "unban",
	description: "Remove a user's ban from server",
	options: [
		{
			name: "user",
			description: "The user to kick(or user id)",
			type: ApplicationCommandOptionType.User,
			required: true
		}
	],
	permissionRequired: [PermissionFlagsBits.BanMembers],
	botPermissions: [PermissionFlagsBits.BanMembers],

	/**
	 *
	 * @param {Client} client
	 * @param {Ineraction} interaction
	 */

	callback: async (client, interaction) => {
		try {
			const requestUserRolePosition =
				interaction.member.roles.highest.position;
			const botRolePosition =
				interaction.guild.members.me.roles.highest.position;

			const targetUserId = interaction.options.get("user").value;
			const isUserBanned = await interaction.guild.bans.fetch(
				targetUserId
			);

			await interaction.deferReply();

			if (botRolePosition >= requestUserRolePosition) {
				await interaction.editReply(
					"You can't unban the user. You have no authority to execute this command!"
				);
				return;
			}

			if (isUserBanned) {
				await interaction.guild.bans.remove(isUserBanned.user.id);
				await interaction.editReply(
					`${isUserBanned.user.username}#${isUserBanned.user.discriminator}'s ban removed. ID: ${isUserBanned.user.id}`
				);
				return;
			} else {
				await interaction.editReply(
					`User cannot be found inside ban list!`
				);
			}
		} catch (error) {
			console.log(`error while unbanning\n${error}`);
		}
	}
};
