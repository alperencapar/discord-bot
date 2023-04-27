const { Schema, model } = require("mongoose")

const chatCommandSchema = new Schema({
	guildId: {
		type: String,
		required: true,
	},
	commandName: {
		type: String,
		required: true,
	},
	commandResponse: {
		type: String,
		required: true,
	},
	commandAlias: {
		type: String,
		required: false,
	},
})

module.exports = model("ChatCommand", chatCommandSchema)
