const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	Interaction,
	EmbedBuilder,
} = require("discord.js")

const LogId = require("../../models/channelLogId")
const {
	findRecord,
	createRecord,
	findOneAndRemoveRecord,
	findAndSelect,
} = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { refreshCache } = require("../../handlers/dbCacheHandler")
const Reaction = require("../../models/Reaction")

module.exports = {
	name: "reaction",
	description: "Tespit edilen mesaja emoji ifade(reaction) ekle.",
	type: ApplicationCommandOptionType.SubcommandGroup,
	options: [
		{
			name: "add",
			description: "Add chat reaction(twitch like)",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "reaction-text",
					description: "İfade eklenecek yazı.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "reaction-emoji",
					description:
						"Sunucu emojisi. Belirttiğiniz yazıya ifade olarak eklenecek.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "reaction-emoji-fallback",
					description:
						"Genel emoji. Sunucu emojisi bulunamaz ise bu emoji eklenecek.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: "delete",
			description: "Delete chat reaction(twitch like)",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "reaction-text",
					description:
						"Silmek istediğiniz ifade yazısı(tetikleyici yazı).",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: "list",
			description: "İfade(reaction) listesi",
			type: ApplicationCommandOptionType.Subcommand,
		},
	],

	permissionsRequired: [PermissionFlagsBits.Administrator],
	botPermissions: [PermissionFlagsBits.SendMessages],

	/**
	 *
	 * @param {*} client
	 * @param {Interaction} interaction
	 * @returns
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			await interaction.reply(
				"Bu komutu sadece sunucuda çalıştırabilirsin"
			)
			return
		}

		const subCommandName = interaction.options.getSubcommand()

		await interaction.channel.sendTyping()

		try {
			let reactionText
			let isRecordExist
			switch (subCommandName) {
				case "add":
					reactionText =
						interaction.options.get("reaction-text").value
					const reactionEmoji =
						interaction.options.get("reaction-emoji").value
					const reactionEmojiFallback = interaction.options.get(
						"reaction-emoji-fallback"
					).value

					isRecordExist = await findRecord(Reaction, {
						guildId: interaction.guildId,
						reactionText: reactionText,
					})

					if (isRecordExist) {
						;(isRecordExist.reactionText = reactionText),
							(isRecordExist.reactionEmoji = reactionEmoji),
							(isRecordExist.reactionEmojiFallback =
								reactionEmojiFallback)

						await isRecordExist.save()
					} else {
						const newRecord = await createRecord(Reaction, {
							guildId: interaction.guildId,
							reactionText: reactionText,
							reactionEmoji: reactionEmoji,
							reactionEmojiFallback: reactionEmojiFallback,
						})

						if (!newRecord) {
							const ErrFileLocation = __dirname + __filename
							errorFileLogHandler(
								error,
								ErrFileLocation,
								interaction
							)
							console.log("err on creating new reaction record")
							await interaction.reply(`Kayıt eklenemedi!`)
							return
						}
					}

					await interaction.reply(
						`İfade kaydı eklendi! Kayıt: ${reactionText}`
					)

					break
				case "delete":
					reactionText =
						interaction.options.get("reaction-text").value

					let delReaction = {
						guildId: interaction.guildId,
						reactionText: reactionText,
					}

					isRecordExist = await findRecord(Reaction, delReaction)
					if (isRecordExist) {
						await findOneAndRemoveRecord(Reaction, delReaction)
						await interaction.reply(
							`İfade kaydı silindi! Silinen ifade kaydı:${reactionText}`
						)

						return
					}

					await interaction.reply(`İfade kaydı bulunamadı!`)

					break
				case "list":
					const allReactionRecords = await findAndSelect(Reaction, {
						guildId: interaction.guildId,
					})

					const embed = new EmbedBuilder({
						color: 0x00ff00,
						description: `İfade Listesi`,
					})

					allReactionRecords.map((reaction, index) => {
						embed.addFields({
							name: `${index + 1} ${reaction.reactionText}`,
							value: `**Yazı/tetikleyici:** ${
								reaction.reactionText
							}\n**Sunucu ifadesi:** ${
								reaction.reactionEmoji || ""
							}\n**Genel ifade:** ${
								reaction.reactionEmojiFallback || ""
							}`,
						})
					})

					await interaction.reply({ embeds: [embed] })

					break

				default:
					break
			}

			await refreshCache(Reaction, {}, "reaction")
		} catch (error) {
			console.log(error)
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction.toString)
		}
	},
}
