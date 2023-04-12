const {
	ApplicationCommandOptionType,
	AttachmentBuilder,
} = require("discord.js")
const Level = require("../../models/Level")
const canvacord = require("canvacord")
const calcLevelXp = require("../../utils/calcLevelXp")
const { findRecord, findAndSelect } = require("../../handlers/dbHandler")
const cooldowns = new Set()

module.exports = {
	name: "level",
	description: "Lookup user's level",
	options: [
		{
			name: "user",
			description: "User to lookup level",
			type: ApplicationCommandOptionType.User,
		},
	],

	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("You can ran this command inside a server!")
		}

		if (cooldowns.has(interaction.member.id)) {
			interaction.reply(
				"Sorgulama yapmanız kısıtlandı, lütfen birkaç dakika bekleyin."
			)
			return
		}

		await interaction.deferReply()

		const mentionedUserId = interaction.options.get("user")?.value
		const userId = mentionedUserId || interaction.member.id

		const targetUser = await interaction.guild.members.fetch(userId)

		const fetchLevel = await findRecord(Level, {
			userId: userId,
			guildId: interaction.guild.id,
		})

		if (!fetchLevel) {
			interaction.editReply(
				mentionedUserId
					? `${targetUser.user.tag} kullanıcısının henüz leveli yok!`
					: `"Henüz leveliniz bulunmuyor`
			)
			return
		}

		// let allLevels = await Level.find({
		// 	guildId: interaction.guild.id,
		// }).select("-_id userId level xp")

		let allLevels = await findAndSelect(
			Level,
			{
				guildId: interaction.guild.id,
			},
			"-_id userId level xp"
		)

		allLevels.sort((a, b) => {
			if (a.level === b.level) {
				return b.xp - a.xp
			} else {
				return b.level - a.level
			}
		})

		let currentRank =
			allLevels.findIndex((level) => level.userId === userId) + 1

		const rank = new canvacord.Rank()
			.setAvatar(targetUser.user.displayAvatarURL({ size: 1024 }))
			.setRank(currentRank)
			.setLevel(fetchLevel.level)
			.setCurrentXP(fetchLevel.xp)
			.setRequiredXP(calcLevelXp(fetchLevel.level))
			.setStatus(
				targetUser.presence?.status
					? targetUser.presence.status
					: "offline"
			)
			.setProgressBar("#FFD700", "COLOR")
			.setUsername(targetUser.user.username)
			.setDiscriminator(targetUser.user.discriminator)

		const data = await rank.build()
		const attachment = new AttachmentBuilder(data)

		interaction.editReply({ files: [attachment] })

		cooldowns.add(interaction.member.id)
		setTimeout(() => {
			cooldowns.delete(interaction.member.id)
		}, 60000)
	},
}
