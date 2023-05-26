const {
	ApplicationCommandOptionType,
	Client,
	BaseInteraction,
	EmbedBuilder,
} = require("discord.js")
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

	/**
	 *
	 * @param {Client} client
	 * @param {BaseInteraction} interaction
	 */

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

			let answer = `%${loveMeter}`

			switch (true) {
				case loveMeter >= 90:
					answer += "💖 Harika bir uyum!"
					break
				case loveMeter >= 80:
					answer += "✨ Muhteşem bir uyum!"
					break
				case loveMeter >= 70:
					answer += "🌸 İyi bir uyum!"
					break
				case loveMeter >= 60:
					answer += "🌺 Harika uyum!"
					break
				case loveMeter >= 50:
					answer += "🌷 Anlaşabilir ikili!"
					break
				case loveMeter >= 40:
					answer += "🌼 İyi bir uyum!"
					break
				case loveMeter >= 30:
					answer += "🌻 Anlaşabiliyorsunuz!"
					break
				default:
					answer += "🌹 Özel bir uyum!"
			}

			const userAvatar = targetUser.user.displayAvatarURL({
				format: "jpg",
				size: 256,
			})
			const commandUserAvatar = interaction.member.user.displayAvatarURL({
				format: "jpg",
				size: 256,
			})

			const loveEmbed = {
				color: 0xff75ac,
				author: {
					name: targetUserNickname,
					icon_url: commandUserAvatar,
				},
				description: `📢${interaction.member.user.toString()} ile ${targetUser.toString()} arasındaki sevgi yüzdeliği hesaplandı!`,
				fields: [
					{
						name: "Sevgi Miktarı:",
						value: answer,
					},
				],
			}

			if (targetUser == interaction.member) {
				loveEmbed.description = `📢${interaction.member.user.toString()} kendinizi sevme oranınız hesaplandı!`

				switch (true) {
					case loveMeter >= 90:
						answer = "💖 Kendinize bayılıyorsunuz! 🚨 🥼"
						break
					case loveMeter >= 80:
						answer = "✨ Kendinizi seviyorsunuz! 🚨 🥼"
						break
					case loveMeter >= 70:
						answer = "🌸 Kendinize bir tutam tutulmuşsunuz! 🚨"
						break
					case loveMeter >= 60:
						answer = "🌺 Kendiniz ile uyum içerisindesiniz!"
						break
					case loveMeter >= 50:
						answer =
							"🌷 Azıcık ondan, azıcık bundan. Yarı yarıya aşk var!"
						break
					case loveMeter >= 40:
						answer = "Tahammül seviyeniz iyi görünüyor!"
						break
					case loveMeter >= 30:
						answer = "Kendinize biraz tahammül edebiliyorsunuz!"
						break
					default:
						answer = "🚨 Dadi dadi acil destek alın! 🚨"
				}
				loveEmbed.fields[0].value = answer
			}
			await interaction.editReply({
				embeds: [new EmbedBuilder(loveEmbed)],
				content: `${targetUser.toString()} ile sevgi miktarı hesaplandı! ❤️`,
			})
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
