const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js")
const { userHasPermission } = require("../../handlers/eventPermissionHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "unban",
	description: "Remove a user's ban from server",
	options: [
		{
			name: "user",
			description: "The user to kick(or user id)",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
	permissionsRequired: [PermissionFlagsBits.BanMembers],
	botPermissions: [PermissionFlagsBits.BanMembers],

	callback: async (client, interaction) => {
		try {
			const targetUserId = interaction.options.get("user").value
			const isUserBanned = await interaction.guild.bans.fetch(
				targetUserId
			)

			await interaction.channel.sendTyping()
			await interaction.deferReply()

			let isMemberHasPermission = userHasPermission(interaction.member, [
				PermissionFlagsBits.BanMembers,
			])

			if (!isMemberHasPermission) {
				await interaction.editReply(
					"You can't unban the user. You don't have permission to execute this command!"
				)
				return
			}

			if (isUserBanned) {
				await interaction.guild.bans.remove(isUserBanned.user.id)
				await interaction.editReply(
					`${isUserBanned.user.username}#${isUserBanned.user.discriminator}'s ban removed. ID: ${isUserBanned.user.id}`
				)
				return
			} else {
				await interaction.editReply(
					`User cannot be found inside ban list!`
				)
			}
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
