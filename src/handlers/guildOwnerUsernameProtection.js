module.exports = async (member) => {
    const guildOwnerID = member.guild.ownerId
	let guildOwner = await member.guild.members.fetch(guildOwnerID)
	guildOwner = guildOwner.user
	const guildOwnerNickname = guildOwner.nickname || guildOwner.username

    // check is user imitating the owner of server
	if (member.user.id != guildOwner.id) {
		if (member.user.username.toLowerCase() === guildOwner.username.toLowerCase()) {
			await member.setNickname(`FAKE ${member.user.username}!`)
		}

		if (member.nickname?.toLowerCase() === guildOwnerNickname.toLowerCase()) {
			console.log("if 2")
			await member.setNickname(`FAKE ${member.nickname}!`)
		}

        if (member.nickname?.toLowerCase() === guildOwner.username.toLowerCase()) {
            await member.setNickname(`FAKE ${member.nickname}!`)
        }
	}
}