const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js")

const LogId = require("../../models/channelLogId")
const { findRecord, createRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "log-config",
	description: "Log channels configuration command of the server",
	options: [
		{
			name: "join-leave",
			description: "Set new user join and leave log channel",
			type: ApplicationCommandOptionType.Channel,
			required: true,
		},
		{
			name: "moderation",
			description: "Set general moderation/bot event log channel",
			type: ApplicationCommandOptionType.Channel,
			required: true,
		},
		{
			name: "rank",
			description: "Set rank/level log channel",
			type: ApplicationCommandOptionType.Channel,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],
	botPermissions: [PermissionFlagsBits.SendMessages],

	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			await interaction.reply(
				"Bu komutu sadece sunucuda çalıştırabilirsin"
			)
			return
		}

		const joinLeaveChannelId = interaction.options.get("join-leave").value
		const moderationLogChannelId =
			interaction.options.get("moderation").value
		const rankChannelId = interaction.options.get("rank")?.value

		try {
			await interaction.deferReply()
			await interaction.channel.sendTyping()

			let logSettings = await findRecord(LogId, {
				guildId: interaction.guild.id,
			})

			if (logSettings) {
				logSettings.joinLeaveChannelId = joinLeaveChannelId
				logSettings.moderationLogChannelId = moderationLogChannelId
				rankChannelId
					? (logSettings.rankChannelId = rankChannelId)
					: (logSettings.rankChannelId = logSettings.rankChannelId)
			} else {
				const newRecord = await createRecord(LogId, {
					guildId: interaction.guild.id,
					joinLeaveChannelId: joinLeaveChannelId,
					moderationLogChannelId: moderationLogChannelId,
					rankChannelId: rankChannelId,
				})

				if (!newRecord) {
					console.log(
						"Error on saving new record to db. @log-configure"
					)
				}
			}

			await logSettings.save()

			await interaction.editReply(`kayıt başarı ile yapıldı.`)
		} catch (error) {
			console.log(
				`Error at saving log channel settings to db. Error: ${error}`
			)
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
