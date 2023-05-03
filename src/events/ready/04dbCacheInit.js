const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { refreshCache } = require("../../handlers/dbCacheHandler")
const ChatCommand = require("../../models/ChatCommand")
const LogId = require("../../models/channelLogId")
const GuildInfo = require("../../models/GuildInfo")

module.exports = async (client) => {
	const cacheItemsList = [
		{
			model: LogId,
			query: {},
			dataName: "logId",
		},
		{
			model: ChatCommand,
			query: {},
			dataName: "chatCommand",
		},
		{
			model: GuildInfo,
			query: {},
			dataName: "guildInfo",
		},
	]
	try {
		for (const cacheItem of cacheItemsList) {
			await refreshCache(
				cacheItem.model,
				cacheItem.query,
				cacheItem.dataName
			)
		}
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "registerCommands.js")
	}
}
