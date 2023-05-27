const { PermissionFlagsBits } = require("discord.js")
const { userHasPermission } = require("./eventPermissionHandler")
const errorFileLogHandler = require("./errorFileLogHandler")

module.exports = async (member) => {
	const guildOwnerID = member.guild.ownerId
	let guildOwner = await member.guild.members.fetch(guildOwnerID)
	const guildOwnerNickname = guildOwner.nickname || guildOwner.user.username
	guildOwner = guildOwner.user

	const bot = member.guild.members.me

	const neededPermissions = [PermissionFlagsBits.ManageNicknames]

	let isBotHasPermission = await userHasPermission(bot, neededPermissions)

	// check is user imitating the owner of server
	if (member.user.id != guildOwner.id) {
		try {
			if (
				member.user.username.toLocaleLowerCase("tr-TR") ===
				guildOwner.username.toLocaleLowerCase("tr-TR")
			) {
				isBotHasPermission
					? await member.setNickname(`FAKE ${member.user.username}!`)
					: null
			}

			if (
				member.nickname?.toLocaleLowerCase("tr-TR") ===
				guildOwnerNickname.toLocaleLowerCase("tr-TR")
			) {
				isBotHasPermission
					? await member.setNickname(`FAKE ${member.nickname}!`)
					: null
			}

			if (
				member.nickname?.toLocaleLowerCase("tr-TR") ===
				guildOwner.username.toLocaleLowerCase("tr-TR")
			) {
				isBotHasPermission
					? await member.setNickname(`FAKE ${member.nickname}!`)
					: null
			}
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, member)
		}
	}
}
