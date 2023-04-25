const { Schema, model } = require("mongoose")

const chatCommandSchema = new Schema({
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
