module.exports = async (member) => {
    const memberCountChannel = await member.guild.channels.fetch("1067601931335376976")
    const channelText = memberCountChannel.name.split(":")[0]
    await member.guild.channels.edit(memberCountChannel, { name: `${channelText}: ${member.guild.memberCount}` })
}