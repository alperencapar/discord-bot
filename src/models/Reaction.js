const { Schema, model } = require("mongoose")

const ReactionSchema = new Schema({
	guildId: {
		type: String,
		required: true,
	},
	reactionText: {
		type: String,
		required: true,
	},
	reactionEmoji: {
		type: String,
		required: true,
	},
	reactionEmojiFallback: {
		type: String,
		required: true,
	},
})

module.exports = model("Reaction", ReactionSchema)
