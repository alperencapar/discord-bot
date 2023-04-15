const { Client, Guild } = require("discord.js")
const GuildInfo = require("../../models/GuildInfo")
const { findRecord, createRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = async (client, guild) => {
	const query = {
		guildId: guild.id,
	}

	try {
		// const guildId = await GuildInfo.findOne(query);
		const guildId = await findRecord(GuildInfo, query)

		if (!guildId) {
			await createRecord(GuildInfo, {
				guildId: guild.id,
			})
		}
	} catch (error) {
		console.log("Error saving guild id(db)")
		console.log(`ERROR DETAILS: \n\n${error}`)
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, guild)
	}
}
