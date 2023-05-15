const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

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

	callback: async (client, interaction) => {
		const targetUserId = interaction.options.get("user").value
		let minutes = interaction.options.get("minutes")?.value || 5
		const reason =
			interaction.options.get("reason")?.value || "No reason given."

		await interaction.channel.sendTyping()
		await interaction.deferReply()

		const targetUser = await interaction.guild.members.fetch(targetUserId)

		if (!targetUser) {
			await interaction.editReply("Kullanıcı sunucuda bulunamadı")
			return
		}

		if (targetUser.id === interaction.guild.ownerId) {
			await interaction.editReply(
				"Sunucu sahibine zamanaşımı veremezsiniz 🧠"
			)
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
				"Bu kullanıcıya zamanaşımı uygulamayazsınız, çünkü kullanıcı sizinle aynı ya da daha yüksek role sahip"
			)
			return
		}
		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				"Bu kullanıcıya zamanaşımı uygulayamam, çünkü kullanıcı benimle aynı ya da daha yüksek role sahip"
			)
			return
		}

		if (minutes > 40319) minutes = 40319
		try {
			await targetUser.timeout(minutes * 60 * 1000, reason)
			await interaction.editReply(
				`${targetUser}, ${minutes} dakikalık zamanaşımına uğratıldı.\nSebep: ${reason}`
			)
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
