const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	EmbedBuilder,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { getRecords } = require("../../handlers/dbCacheHandler")

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
			await interaction.editReply("Kullanıcı bu sunucuda bulunamadı!")
			return
		}

		if (targetUser.id === interaction.guild.ownerId) {
			await interaction.editReply("Sunucu sahibi sunucudan atılamaz 🧠")
			return
		}

		if (targetUser.id == interaction.user.id) {
			await interaction.editReply({
				content: "Kendinizi sunucudan atamazsınız 🧠",
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
					"Bu kullanıcıyı sunucudan atamazsınız, çünkü kullanıcı sizinle aynı ya da daha yüksek role sahip 📈",
				ephemeral: true,
			})
			return
		}
		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply({
				content:
					"Bu kullanıcıyı sunucudan atamam, çünkü kullanıcı benim ile aynı ya da daha yüksek role sahip 📈",
				ephemeral: true,
			})
			return
		}

		try {
			await targetUser.kick(reason)
			await interaction.editReply(
				`${targetUser} sunucudan atıldı. Sebep: ${reason}`
			)

			let logSettings = await getRecords(LogId, {}, "logId")
			if (!logSettings) return

			let logSetting = logSettings.find((logSetting) => {
				if (logSetting.guildId == interaction.guild.id) {
					return logSetting
				}
			})

			if (!logSetting?.moderationLogChannelId) return

			let logChannel = await interaction.guild.channels.fetch(
				logSetting.moderationLogChannelId
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
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
