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
		message.content.toLocaleLowerCase("tr-TR")
	).toLocaleLowerCase("tr-TR")

	allGuildReactions.map((reactionRecord) => {
		if (reactionRecord.guildId == message.guildId) {
			if (
				clearedMessageContent.includes(
					reactionRecord.reactionText.toLocaleLowerCase("tr-TR")
				)
			) {
				const regex = /<:(.*?):(\d+)>/
				const emojiMatch = reactionRecord.reactionEmoji?.match(regex)

				let emoji
				if (emojiMatch) {
					const emojiId = emojiMatch[2]
					emoji = message.guild.emojis.cache.find(
						(emoji) => emoji.id == emojiId
					)

					if (!emoji || !emoji?.available) {
						emoji = reactionRecord.reactionEmojiFallback
					}
				} else {
					emoji = reactionRecord.reactionEmojiFallback
				}
				message.react(emoji)

				return
			}
		}
	})
}
