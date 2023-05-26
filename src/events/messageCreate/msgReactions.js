const { Message } = require("discord.js")
const repeatingLetterHandler = require("../../handlers/repeatingLetterHandler")
const Reaction = require("../../models/Reaction")
const { getRecords } = require("../../handlers/dbCacheHandler")

/**
 *
 * @param {*} client
 * @param {Message} message
 * @returns
 */

module.exports = async (client, message) => {
	if (message.author.bot) return

	let allGuildReactions = await getRecords(Reaction, {}, "reaction")
	if (!allGuildReactions) return

	let guildReactionRecords = allGuildReactions.find((reactionRecord) => {
		if (reactionRecord.guildId == message.guildId) {
			return reactionRecord
		}
	})

	if (!guildReactionRecords) return

	let clearedMessageContent = repeatingLetterHandler(
		message.content.toLowerCase()
	).toLowerCase()

	allGuildReactions.map((reactionRecord) => {
		if (reactionRecord.guildId == message.guildId) {
			if (clearedMessageContent.includes(reactionRecord.reactionText)) {
				const emoji = message.guild.emojis.cache.find((emoji) => {
					return (
						emoji.name.includes(reactionRecord.reactionEmoji) ||
						reactionRecord.reactionEmojiFallback
					)
				})
				message.react(emoji)

				return
			}
		}
	})

	/* 
	if (
		message.content.toLowerCase().includes("geceler") ||
		message.content.toLowerCase().includes("gclr")
	) {
		const nights = [
			"iyi geceler",
			"iyigeceler",
			"yi geceler",
			"yigeceler",
			"ıyı geceler",
			"ıyıgeceler",
			"iyi mi geceler",
			"iyi gecelr",
			"iyi gecler",
			"iyi geclr",
			"iyi gclr",
			"iyigclr",
			"yi gclr",
			"yigclr",
		]

		let clearedMessageContent = repeatingLetterHandler(
			message.content
		).toLowerCase()

		for (const night of nights) {
			if (clearedMessageContent.includes(night)) {
				message.react("🥛")

				return
			}
		}
	}
	*/
}
