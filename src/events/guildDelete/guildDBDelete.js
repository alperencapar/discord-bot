const { findOneAndRemoveRecord } = require("../../handlers/dbHandler")
const GuildInfo = require("../../models/GuildInfo")

module.exports = async (client, guild) => {
	try {
		const query = {
			guildId: guild.id,
		}

		await findOneAndRemoveRecord(GuildInfo, query)
	} catch (error) {
		console.log("error at deleting guild id from db")
	}
}
