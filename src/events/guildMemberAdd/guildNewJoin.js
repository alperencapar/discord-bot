const { EmbedBuilder } = require("@discordjs/builders")
const LogId = require("../../models/channelLogId")
const guildUserCountHandler = require("../../handlers/guildUserCountHandler")
const { findRecord } = require("../../handlers/dbHandler")

module.exports = async (client, member) => {
	console.log("guildMemberAdd")

	await guildUserCountHandler(member)

	const userAvatar = member.user.displayAvatarURL({
		format: "jpg",
		size: 4096,
	})

	const roles =
		member._roles.length > 0
			? member._roles.map((role) => `<@&${role}>`).join("\n")
			: ""

	const embedData = {
		color: 0x0099ff,
		description: `✍${member.user.toString()} sunucuya giriş yaptı`,
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

	try {
		let logSettings = await findRecord(LogId, {
			guildId: member.guild.id,
		})

		if (logSettings.joinLeaveChannelId) {
			let logChannel = await member.guild.channels.fetch(
				logSettings.joinLeaveChannelId
			)
			await logChannel.send({ embeds: [embed] })
		}
	} catch (error) {
		console.log("Error at nickname protection")
		console.log(`Detail: \n\n\n ${error}`)
	}
}
