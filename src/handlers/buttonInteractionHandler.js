const errorFileLogHandler = require("./errorFileLogHandler")

module.exports = async (client, interaction) => {
	const role = interaction.guild.roles.cache.get(interaction.customId)

	await interaction.deferReply({ ephemeral: true })

	if (!role) {
		await interaction.editReply({
			content: "Rol Bulunamadı",
		})
	}

	try {
		const hasRole = interaction.member.roles.cache.has(role.id)
		if (hasRole) {
			await interaction.member.roles.remove(role)
			await interaction.editReply(`${role} rolü kaldırıldı`)
			return
		}

		await interaction.member.roles.add(role)
		await interaction.editReply(`${role} rolü eklendi`)
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, interaction)
	}
}
