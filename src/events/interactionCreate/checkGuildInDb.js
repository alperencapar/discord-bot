const { Client, CommandInteraction } = require("discord.js")
const { createRecord } = require("../../handlers/dbHandler")
const GuildInfo = require("../../models/GuildInfo")
const { getRecords } = require("../../handlers/dbCacheHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @returns
 */
module.exports = async (client, interaction) => {
	if (!interaction.isChatInputCommand() && !interaction.inGuild()) return

	try {
		let allGuilds = await getRecords(GuildInfo, {}, "guildInfo")

		let guildRecord = allGuilds.find((guildInfo) => {
			if (guildInfo.guildId == interaction.guildId) {
				return guildInfo
			}
		})

		if (!guildRecord && !guildRecord?.guildId) {
			await createRecord(GuildInfo, {
				guildId: interaction.guildId,
			})
		}
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "registerCommands.js")
	}
}
