const {
	PermissionFlagsBits,
	Client,
	Message,
	EmbedBuilder,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const { findRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message, missingPermissions = []) => {
	try {
		const msg = message.content
		const msgUser = message.author
		const messageChannel = await message.channel.fetch(message.channelId)

		if (msgUser.bot || (msgUser === null && msg === null)) return

		const userAvatar = msgUser.displayAvatarURL({
			format: "jpg",
			size: 4096,
		})

		const embedData = {
			color: 0x0099ff,
			description: `🗑Mesaj silindi🗑`,
			author: {
				name: `${msgUser.username}#${msgUser.discriminator}`,
				icon_url: userAvatar,
			},
			fields: [
				{
					name: `Silinen Mesaj:`,
					value: `${msg}`,
				},
				{
					name: "Mesajın gönderildiği kanal:",
					value: `${messageChannel.toString()}`,
				},
				{
					name: "Mesaj ID:",
					value: `${message.id}`,
					inline: true,
				},
			],
			footer: {
				text: `USER ID: ${msgUser.id}`,
			},
		}
		const embed = new EmbedBuilder(embedData)
		embed.setTimestamp()

		let logSettings = await findRecord(LogId, {
			guildId: message.guildId,
		})

		if (logSettings?.moderationLogChannelId) {
			const guild = await client.guilds.fetch(message.guildId)
			let logChannel = await guild.channels.fetch(
				logSettings.moderationLogChannelId
			)

			if (!missingPermissions?.includes("EmbedLinks"))
				await logChannel.send({ embeds: [embed] })
		}
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, message)
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
