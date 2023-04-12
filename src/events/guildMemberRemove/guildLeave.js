// const {	EmbedBuilder } = require("@discordjs/builders");

const { EmbedBuilder } = require("@discordjs/builders")
const guildUserCountHandler = require("../../handlers/guildUserCountHandler")
const { findRecord } = require("../../handlers/dbHandler")

module.exports = async (client, member) => {
	console.log("guildMemberRemove")

	await guildUserCountHandler(member)

	const userAvatar = member.user.displayAvatarURL({
		format: "jpg",
		size: 4096,
	})

	const roles =
		member._roles.length > 0
			? member._roles.map((role) => `<@&${role}>`).join("\n")
			: ""

	const discordJoinDate = member.user?.createdAt?.toLocaleString("tr-tr", {
		timeZone: "Turkey",
	})

	const guildJoinDate = new Date(member.joinedTimestamp).toLocaleString(
		"tr-tr",
		{
			timeZone: "Turkey",
		}
	)

	const embedData = {
		color: 0x0099ff,
		description: `✍${member.user.toString()} sunucudan çıkış yaptı`,
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
