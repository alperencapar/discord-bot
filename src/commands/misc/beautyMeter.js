const { ApplicationCommandOptionType } = require("discord.js")
const randomNumberGenerate = require("../../utils/randomNumberGenerate")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "güzellik",
	description: "Shows user beauty level",
	options: [
		{
			name: "user",
			description: "User that you want to check beauty level",
			type: ApplicationCommandOptionType.User,
			required: false,
		},
	],

	callback: async (client, interaction) => {
		await interaction.channel.sendTyping()
		await interaction.deferReply()
		await interaction.editReply(
			`${interaction.user.toString()} güzellik seviyeniz hesaplanıyor...`
		)

		try {
			const targetUserId = interaction.options.get("user")?.value
			let targetUser = interaction.user
			let targetUserNickname = interaction.nickname

			let randomNumbers = await randomNumberGenerate(120, 10)
			let total = 0

			for (const num of randomNumbers) {
				total += num
			}

			let beautyMeter = total / randomNumbers.length
			beautyMeter = parseFloat(beautyMeter.toFixed(2))

			if (beautyMeter >= 100) beautyMeter = 99.99

			let answer = `%${beautyMeter}`

			switch (true) {
				case beautyMeter >= 90:
					answer +=
						"💖 Göz kamaştırıcı bir güzelliğe sahipsiniz!💫 Akıllara zarar 🤙"
					break
				case beautyMeter >= 80:
					answer += "✨ Çok güzel bir görünüme sahipsiniz! 😍"
					break
				case beautyMeter >= 70:
					answer += "🌸 Harika görünüyorsunuz! 🌟"
					break
				case beautyMeter >= 60:
					answer += "🌺 Çok hoş bir görüntünüz var!"
					break
				case beautyMeter >= 50:
					answer += "🌷 Oldukça güzelsiniz!"
					break
				case beautyMeter >= 40:
					answer += "🌼 Güzel bir görünümünüz var!"
					break
				case beautyMeter >= 30:
					answer += "🌻 Hoş bir görüntünüz var! 😉"
					break
				default:
					answer += "🌹 Kendine özgü bir güzelliğiniz var! 🌟"
			}

			if (targetUserId) {
				targetUser = await interaction.guild.members.fetch(targetUserId)
				targetUserNickname = targetUser.nickname
			}

			let userAvatar = targetUser.displayAvatarURL({
				format: "jpg",
				size: 128,
			})

			const beautyEmbed = {
				color: 0xff75ac,
				author: {
					name: `${
						targetUserNickname ||
						targetUser.username ||
						targetUser.user.username
					}`,
					icon_url: userAvatar,
				},
				thumbnail: {
					url: userAvatar,
				},
				fields: [
					{
						name: "Güzellik Seviyesi💄:",
						value: answer,
					},
				],
			}

			await interaction.editReply({
				embeds: [beautyEmbed],
				content: `${targetUser.toString()} güzellik ortalaması hesaplandı🎉`,
			})
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
