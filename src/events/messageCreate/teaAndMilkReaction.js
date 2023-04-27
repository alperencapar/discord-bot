const repeatingLetterHandler = require("../../handlers/repeatingLetterHandler")

module.exports = async (client, message) => {
	if (message.author.bot) return

	if (
		message.content.toLowerCase().includes("güna") ||
		message.content.toLowerCase().includes("gunayd") ||
		message.content.toLowerCase().includes("gnydn")
	) {
		const mornings = [
			"günaydın",
			"gunaydın",
			"günaydı",
			"gunaydı",
			"günaymadı",
			"gunaymadı",
			"günydn",
			"gunydn",
			"gnydn",
			"tünaydın",
			"tünaydı",
			"tunaydin",
			"selmalar",
			"selamlar",
			"selams",
			"selam",
			"slm",
		]

		let clearedMessageContent = repeatingLetterHandler(
			message.content
		).toLowerCase()

		for (const morning of mornings) {
			if (clearedMessageContent.includes(morning)) {
				const emoji =
					message.guild.emojis.cache.find((emoji) =>
						emoji.name.includes("sakinle")
					) || "☕"
				message.react(emoji)

				return
			}
		}
	}

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
}
