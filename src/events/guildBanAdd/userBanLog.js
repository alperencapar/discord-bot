const {
	PermissionFlagsBits,
	EmbedBuilder,
	Client,
	GuildBan,
} = require("discord.js")
const LogId = require("../../models/channelLogId")
const { findRecord } = require("../../handlers/dbHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

/**
 *
 * @param {Client} client
 * @param {GuildBan} guildBan
 */
module.exports = async (client, guildBan, missingPermissions = []) => {
	const userAvatar = guildBan.user.displayAvatarURL({
		format: "jpg",
		size: 4096,
	})

	const embedData = {
		color: 0x0099ff,
		description: `${guildBan.user.toString()} sunucudan banlandı! 🚫`,
		author: {
			name: `${guildBan.user.username}#${guildBan.user.discriminator}`,
			icon_url: userAvatar,
		},
		thumbnail: {
			url: userAvatar,
		},
		fields: [
			{
				name: `Sebep:`,
				value: `${
					guildBan.reason ? guildBan.reason : "Sebep belirtilmedi."
				}`,
			},
		],
		footer: {
			text: `USER ID: ${guildBan.user.id}`,
		},
	}

	const embed = new EmbedBuilder(embedData)
	embed.setTimestamp()

	try {
		let logSettings = await findRecord(LogId, {
			guildId: guildBan.guild.id,
		})

		if (logSettings?.moderationLogChannelId) {
			let logChannel = await guildBan.guild.channels.fetch(
				logSettings.moderationLogChannelId
			)

			if (!missingPermissions?.includes("EmbedLinks"))
				await logChannel.send({ embeds: [embed] })
		}
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, guildBan)
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
