const { EmbedBuilder } = require("@discordjs/builders");
const guildOwnerUsernameProtection = require("../../handlers/guildOwnerUsernameProtection");

module.exports = async (client, member) => {
	const [oldMember, newMember] = member;

    guildOwnerUsernameProtection(newMember);

	const userAvatar = newMember.user.displayAvatarURL({
		format: "jpg",
		size: 4096
	});


	if (oldMember.nickname?.toLowerCase() !== newMember.nickname?.toLowerCase()) {

		const embedData = {
			color: 0x0099ff,
			description: `✍${newMember.user.toString()} kullanıcı adını düzenledi`,
			author: {
				name: `${newMember.user.username}#${newMember.user.discriminator}`,
				icon_url: userAvatar
			},
			thumbnail: {
				url: userAvatar
			},
			fields: [
				{
					name: `Eski kullanıcı adı`,
					value: `${oldMember.nickname || oldMember.user.username}`,
					inline: true
				},
	
				{
					name: "Yeni kullanıcı adı",
					value: `${newMember?.nickname || newMember.user.username}`,
					inline: true
				}
			]
		};
	
		const embed = new EmbedBuilder(embedData)
		embed.setTimestamp();
	
		try {
			const channel = await newMember.guild.channels.fetch("1064183114202611823");
			await channel.send({ embeds: [embed] });
			
		} catch (error) {
			const channel = await newMember.guild.channels.fetch("1064522834514292807");
			await channel.send({ embeds: [embed] });
		}

	}

};
