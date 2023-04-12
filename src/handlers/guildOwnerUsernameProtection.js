const { PermissionFlagsBits } = require("discord.js")
const { userHasPermission } = require("./eventPermissionHandler")

module.exports = async (member) => {
	const guildOwnerID = member.guild.ownerId
	let guildOwner = await member.guild.members.fetch(guildOwnerID)
	const guildOwnerNickname = guildOwner.nickname || guildOwner.user.username
	guildOwner = guildOwner.user

	const bot = newMember.guild.members.me

	const neededPermissions = [PermissionFlagsBits.ManageNicknames]

	let isBotHasPermission = await userHasPermission(bot, neededPermissions)

	// check is user imitating the owner of server
	if (member.user.id != guildOwner.id) {
		try {
			if (
				member.user.username.toLowerCase() ===
				guildOwner.username.toLowerCase()
			) {
				isBotHasPermission
					? await member.setNickname(`FAKE ${member.user.username}!`)
					: null
			}

			if (
				member.nickname?.toLowerCase() ===
				guildOwnerNickname.toLowerCase()
			) {
				isBotHasPermission
					? await member.setNickname(`FAKE ${member.nickname}!`)
					: null
			}

			if (
				member.nickname?.toLowerCase() ===
				guildOwner.username.toLowerCase()
			) {
				isBotHasPermission
					? await member.setNickname(`FAKE ${member.nickname}!`)
					: null
			}
		} catch (error) {
			console.log("not enough permission to change nickname of user")
			console.log(error)
		}
	}
}
