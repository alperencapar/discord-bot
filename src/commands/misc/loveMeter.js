const { ApplicationCommandOptionType } = require("discord.js")
const randomNumberGenerate = require("../../utils/randomNumberGenerate")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "sevgi",
	description: "İki kullanıcı arasındaki sevgi miktarını gösterir.",
	options: [
		{
			name: "user",
			description: "Sevgi miktarını kontrol etmek istediğiniz kullanıcı",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],

	callback: async (client, interaction) => {
		await interaction.deferReply()
		await interaction.editReply(
			`${interaction.user.toString()} sevgi miktarı hesaplanıyor...`
		)

		try {
			const targetUserId = interaction.options.get("user").value
			const targetUser = await interaction.guild.members.fetch(
				targetUserId
			)
			const targetUserNickname =
				targetUser.nickname || targetUser.user.username

			const randomNumbers = await randomNumberGenerate(100, 10)
			let total = 0

			for (const num of randomNumbers) {
				total += num
			}

			let loveMeter = total / randomNumbers.length
			loveMeter = parseFloat(loveMeter.toFixed(2))

			let answer = `${loveMeter}%`

			switch (true) {
				case loveMeter >= 90:
					answer += "💖 Harika bir uyum!"
					break
				case loveMeter >= 80:
					answer += "✨ Muhteşem bir uyum!"
					break
				case loveMeter >= 70:
					answer += "🌸 İyi bir anlaşma!"
					break
				case loveMeter >= 60:
					answer += "🌺 Harika uyum!"
					break
				case loveMeter >= 50:
					answer += "🌷 Anlaşabilir bir ikili!"
					break
				case loveMeter >= 40:
					answer += "🌼 İyi bir uyum!"
					break
				case loveMeter >= 30:
					answer += "🌻 Anlaşabilirlik var!"
					break
				default:
					answer += "🌹 Özel bir uyum!"
			}

			const userAvatar = targetUser.user.displayAvatarURL({
				format: "jpg",
				size: 128,
			})

			const loveEmbed = {
				color: 0xff75ac,
				author: {
					name: targetUserNickname,
					icon_url: userAvatar,
				},
				thumbnail: {
					url: userAvatar,
				},
				fields: [
					{
						name: "Sevgi Miktarı:",
						value: answer,
					},
				],
			}

			await interaction.editReply({
				embeds: [loveEmbed],
				content: `${targetUser.toString()} ile sevgi miktarı hesaplandı! ❤️`,
			})
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
