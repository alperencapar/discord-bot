const randomXpGenerate = require("../../utils/randomXpGenerate")
const Level = require("../../models/Level")
const LogId = require("../../models/channelLogId")
const calcLevelXp = require("../../utils/calcLevelXp")
const cooldowns = new Set()

const { Client, Message } = require("discord.js")
const { findRecord, createRecord } = require("../../handlers/dbHandler")
/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns
 */

module.exports = async (client, message) => {
	if (
		!message.inGuild() ||
		message.author.bot ||
		cooldowns.has(message.author.id)
	)
		return

	const xpToGive = randomXpGenerate(25, 50)

	const query = {
		userId: message.author.id,
		guildId: message.guild.id,
	}

	try {
		const level = await findRecord(Level, query)

		if (level) {
			level.xp += xpToGive

			if (level.xp > calcLevelXp(level.level)) {
				const remainingXp = level.xp - calcLevelXp(level.level)
				level.xp = remainingXp
				level.level += 1

				await interaction.channel.sendTyping()

				let logSettings = await findRecord(LogId, {
					guildId: message.guild.id,
				})

				let rankChannel

				if (logSettings.rankChannelId) {
					rankChannel = await message.guild.channels.fetch(
						logSettings.rankChannelId
					)
				} else {
					rankChannel = message.channel
				}

				rankChannel.send(`${message.member} level ${level.level} oldu!`)
			}

			await level.save().catch((err) => {
				console.log(`Error on saving level ${e}`)
				return
			})

			cooldowns.add(message.author.id)
			setTimeout(() => {
				cooldowns.delete(message.author.id)
			}, 60000)
		} else {
			// create new level record

			const newLevelQuery = {
				userId: message.author.id,
				guildId: message.guild.id,
				xp: xpToGive,
			}

			const newLevel = await createRecord(Level, newLevelQuery)

			cooldowns.add(message.author.id)
			setTimeout(() => {
				cooldowns.delete(message.author.id)
			}, 60000)
		}
	} catch (error) {
		console.log(`Error on giving xp: ${error}`)
	}
}
