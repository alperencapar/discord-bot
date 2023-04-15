const { findOneAndRemoveRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const GuildInfo = require("../../models/GuildInfo")

module.exports = async (client, guild) => {
	try {
		const query = {
			guildId: guild.id,
		}

		await findOneAndRemoveRecord(GuildInfo, query)
	} catch (error) {
		console.log("error at deleting guild id from db")
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "guildDBDelete.js")
	}
}
