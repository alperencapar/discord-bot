const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const randomNumberGenerate = require("../../utils/randomNumberGenerate");

module.exports = {
	name: "güzellik",
	description: "Shows user beauty level",
	options: [
		{
			name: "user",
			description: "User that you want to check beauty level",
			type: ApplicationCommandOptionType.User,
			required: false
		}
	],

	callback: async (client, interaction) => {
		await interaction.deferReply();
        await interaction.editReply(`${interaction.user.toString()} güzellik ortalamanız hesaplanıyor...`)

		const targetUserId = interaction.options.get("user")?.value;
		let targetUser = interaction.user
		let targetUserNickname = interaction.nickname

		let randomNumbers = await randomNumberGenerate(99, 10)
		let total = 0

		for (const num of randomNumbers) {
			total += num
		}

		let beautyMeter = total / randomNumbers.length
		beautyMeter = parseFloat(beautyMeter.toFixed(2))

		let answer = `%${beautyMeter}`
		
		if (beautyMeter >= 75) {
			answer = `%${beautyMeter}\nVuhuuu 🤩 Güzelsin hee`
		} else if (beautyMeter >= 50 && beautyMeter < 75) {
			answer = `%${beautyMeter}\nGüzelsin be😇`
		} else if (beautyMeter >= 30 && beautyMeter < 50) {
			answer = `%${beautyMeter}\n🤠`
		} else if (beautyMeter <= 30 ) {
			answer = `%${beautyMeter}\nGüzelleşirsin be🤠`
		}

		
		if(targetUserId) {
			targetUser = await interaction.guild.members.fetch(targetUserId);
			targetUserNickname = targetUser.nickname
			
		} 
		
		let userAvatar = targetUser.displayAvatarURL({
			format: "jpg",
			size: 128
		});

		const beautyEmbed = {
			color: 0xff75ac,
			author: {
                name: `${targetUserNickname || targetUser.username || targetUser.user.username}`,
				icon_url: userAvatar
			},
			thumbnail: {
				url: userAvatar
			},
			fields: [
				{
					name: "Güzellik Seviyesi:",
					value: answer
				}
			],

		};

		await interaction.editReply(
			{ embeds: [beautyEmbed], content: `${targetUser.toString()} güzellik ortalaması hesaplandı🎉`}
		);

	}
};
