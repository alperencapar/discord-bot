module.exports = async (member) => {
    const guildOwnerID = member.guild.ownerId
	let guildOwner = await member.guild.members.fetch(guildOwnerID)
	const guildOwnerNickname = guildOwner.nickname || guildOwner.user.username
	guildOwner = guildOwner.user

    // check is user imitating the owner of server
	if (member.user.id != guildOwner.id) {
		if (member.user.username.toLowerCase() === guildOwner.username.toLowerCase()) {
			await member.setNickname(`FAKE ${member.user.username}!`)
		}

		if (member.nickname?.toLowerCase() === guildOwnerNickname.toLowerCase()) {
			await member.setNickname(`FAKE ${member.nickname}!`)
		}

        if (member.nickname?.toLowerCase() === guildOwner.username.toLowerCase()) {
            await member.setNickname(`FAKE ${member.nickname}!`)
        }
	}
}