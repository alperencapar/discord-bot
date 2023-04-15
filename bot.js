require("dotenv").config()
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js")
const mongoose = require("mongoose")
const eventHandler = require("./src/handlers/eventHandler")
const errorHandler = require("./src/handlers/errorHandler")
const errorFileLogHandler = require("./src/handlers/errorFileLogHandler")

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember,
		Partials.Reaction,
	],
})

;(async () => {
	try {
		mongoose.set("strictQuery", false)
		await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true })
		console.log("✅Connected to DB✅")
		eventHandler(client)

		client.login(process.env.TOKEN)
	} catch (error) {
		console.log("*****Error on connecting to DB*****")
		console.log("\n\n\n")
		console.log(`ERROR: \n${error}`)
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "mainFile")
	}
})()

errorHandler()
