// const {	EmbedBuilder } = require("@discordjs/builders");

const { EmbedBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits } = require("discord.js")
const LogId = require("../../models/channelLogId")
const guildUserCountHandler = require("../../handlers/guildUserCountHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const { getRecords } = require("../../handlers/dbCacheHandler")

module.exports = async (client, member, missingPermissions) => {
	// await guildUserCountHandler(member)

	try {
		if (missingPermissions.includes("EmbedLinks")) return

		let logSettings = await getRecords(LogId, {}, "logId")
		if (!logSettings) return

		let logSetting = logSettings.find((logSetting) => {
			if (logSetting.guildId == member.guild.id) {
				return logSetting
			}
		})

		if (!logSetting?.joinLeaveChannelId) return

		const guildUserCount = member.guild.memberCount

		const userAvatar = member.user.displayAvatarURL({
			format: "jpg",
			size: 4096,
		})

		const roles =
			member._roles.length > 0
				? member._roles.map((role) => `<@&${role}>`).join("\n")
				: ""

		const discordJoinDate = member.user?.createdAt?.toLocaleString(
			"tr-tr",
			{
				timeZone: "Turkey",
			}
		)

		const guildJoinDate = new Date(member.joinedTimestamp).toLocaleString(
			"tr-tr",
			{
				timeZone: "Turkey",
			}
		)

		const embedData = {
			color: 0x0099ff,
			description: `💨${member.user.toString()} sunucudan çıkış yaptı`,
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
				},
				{
					name: "Discord Üyelik Tarihi",
					value: discordJoinDate,
					inline: true,
				},
				{
					name: "Sunucu Üyelik Tarihi",
					value: guildJoinDate,
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

		let logChannel = await member.guild.channels.fetch(
			logSetting.joinLeaveChannelId
		)

		await logChannel.send({
			embeds: [embed],
			content: `Sunucu üye sayısı: ${guildUserCount}`,
		})
	} catch (error) {
		console.log(`Detail: \n\n\n ${error}`)
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "guildLeave.js")
	}
}

module.exports.botPermissions = [PermissionFlagsBits.EmbedLinks]
