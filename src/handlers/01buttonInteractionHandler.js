const { Client, ButtonInteraction } = require("discord.js")
const errorFileLogHandler = require("./errorFileLogHandler")

module.exports = async (client, interaction) => {
	// await interaction.deferReply({ ephemeral: true })
	// try {
	// 	const role = interaction.guild.roles.fetch(interaction.customId)
	// 	if (!role) {
	// 		await interaction.editReply({
	// 			content: "Rol Bulunamadı",
	// 		})
	// 		return
	// 	}
	// 	await interaction.member.roles.add(role)
	// 	await interaction.editReply(`${role} rolü eklendi`)
	// } catch (error) {
	// 	const ErrFileLocation = __dirname + __filename
	// 	errorFileLogHandler(error, ErrFileLocation, interaction)
	// }
}
