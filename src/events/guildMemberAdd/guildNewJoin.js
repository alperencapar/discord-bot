const { EmbedBuilder } = require("@discordjs/builders")
const LogId = require("../../models/channelLogId")
const guildUserCountHandler = require("../../handlers/guildUserCountHandler")
const { PermissionFlagsBits } = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const guildOwnerUsernameProtection = require("../../handlers/guildOwnerUsernameProtection")
const { getRecords } = require("../../handlers/chatCommandCacheHandler")

module.exports = async (client, member, missingPermissions = []) => {
	// await guildUserCountHandler(member)

	try {
		if (missingPermissions?.includes("EmbedLinks")) return

		let logSettings = await getRecords(LogId, {}, "logId")
		if (!logSettings) return

		let logSetting = logSettings.find((logSetting) => {
			if (logSetting.guildId == member.guild.id) {
				return logSetting
			}
		})

		if (!logSetting && !logSetting?.moderationLogChannelId) return

		let logChannel = await member.guild.channels.fetch(
			logSetting.joinLeaveChannelId
		)

		const guildUserCount = member.guild.memberCount

		const userAvatar = member.user.displayAvatarURL({
			format: "jpg",
			size: 4096,
		})

		if (!missingPermissions?.includes("ManageNicknames"))
			guildOwnerUsernameProtection(member)

		const roles =
			member._roles.length > 0
				? member._roles.map((role) => `<@&${role}>`).join("\n")
				: ""

		const embedData = {
			color: 0x0099ff,
			description: `👤${member.user.toString()} sunucuya giriş yaptı`,
			author: {
				name: `${member.user.username}#${member.user.discriminator}`,
				icon_url: userAvatar,
			},
			thumbnail: {
				url: userAvatar,
			},
			fields: [
				{
					name: "Kullanıcı Adı",
					value: `${member?.nickname || member.user.username}`,
					inline: true,
				},
				{
					name: "Discord Üyelik Tarihi",
					value: `${member.user?.createdAt?.toLocaleString("tr-tr", {
						timeZone: "Turkey",
					})}`,
					inline: true,
				},
				{
					name: "Rolleri",
					value: roles,
				},
			],
			footer: {
				text: `USER ID: ${member.user.id}`,
			},
		}

		const embed = new EmbedBuilder(embedData)
		embed.setTimestamp()

		await logChannel.send({
			embeds: [embed],
			content: `Sunucu üye sayısı: ${guildUserCount}`,
		})
	} catch (error) {
		console.log(`Detail: \n\n\n ${error}`)
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "guildNewJoin.js")
	}
}

module.exports.botPermissions = [
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.ManageNicknames,
]
