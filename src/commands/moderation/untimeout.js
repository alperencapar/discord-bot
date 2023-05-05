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
			await interaction.editReply("Kullanıcı sunucuda bulunamadı")
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
				"Kullanıcının zamanaşımı kaldırılamıyor, çünkü kullanıcı sizinle aynı ya da daha yüksek role sahip"
			)
			return
		}

		try {
			await targetUser.timeout(minutes, reason)
			await interaction.editReply(
				`${targetUser}adlı kullanıcının zamanaşımı kaldırıldı.\nSebep: ${reason}`
			)
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
