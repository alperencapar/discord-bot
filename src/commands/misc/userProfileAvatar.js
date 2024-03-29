const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
// const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
	name: "avatar",
	description: "Show user profile photo",
	options: [
		{
			name: "user",
			description: "Tag user or user id",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],

	callback: async (client, interaction) => {
		try {
			const credential = interaction.options.get("user")
			const full_username = `${credential.user.username}#${credential.user.discriminator}`
			const user_avatar_url = credential.user.displayAvatarURL({
				format: "jpg",
				size: 4096,
			})

			await interaction.channel.sendTyping()
			await interaction.deferReply()

			const embed = new EmbedBuilder()
				.setTitle("Kullanıcı Profil Fotoğrafı")
				.setAuthor({
					name: full_username,
					iconURL: user_avatar_url,
				})
				.setImage(user_avatar_url)
				.setTimestamp()
				.setFooter({ text: `User id: ${credential.user.id}` })

			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
