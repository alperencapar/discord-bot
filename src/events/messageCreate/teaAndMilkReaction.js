const repeatingLetterHandler = require("../../handlers/repeatingLetterHandler");

module.exports = async (client, message) => {

	if (message.author.bot) return;

	if (message.content.includes("gün") || message.content.includes("gece")) {
        let clearedMessageContent = repeatingLetterHandler(message.content)
        
        if (clearedMessageContent.includes("günaydın")) {
            const emoji = message.guild.emojis.cache.find(
                (emoji) => emoji.name === "sakinle"
            );
            // message.react("☕");
            message.react(emoji);
        }
    
        if (clearedMessageContent.includes("iyi geceler")) {
            message.react("🥛");
        }

	}

}