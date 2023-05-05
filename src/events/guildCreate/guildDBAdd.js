const { Client, Guild } = require("discord.js")
const GuildInfo = require("../../models/GuildInfo")
const { createRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { refreshCache } = require("../../handlers/dbCacheHandler")

module.exports = async (client, guild) => {
	try {
		let allGuilds = await getRecords(GuildInfo, {}, "guildInfo")
		if (!allGuilds) return

		let guildRecord = allGuilds.find((guildInfo) => {
			if (guildInfo.guildId == guild.id) {
				return guildInfo
			}
		})

		if (!guildRecord) {
			await createRecord(GuildInfo, {
				guildId: interaction.guildId,
			})

			await refreshCache(GuildInfo, {}, "guildInfo")
		}
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, guild)
	}
}
