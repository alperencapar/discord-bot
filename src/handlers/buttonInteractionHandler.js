module.exports = async (client, interaction) => {
	const role = interaction.guild.roles.cache.get(interaction.customId);

	await interaction.deferReply({ ephemeral: true });

	if (!role) {
		interaction.editReply({
			content: "Rol Bulunamadı"
		});
	}

	const hasRole = interaction.member.roles.cache.has(role.id);
	if (hasRole) {
		await interaction.member.roles.remove(role);
		await interaction.editReply(`${role} rolü kaldırıldı`);
		return;
	}

	await interaction.member.roles.add(role);
	await interaction.editReply(`${role} rolü eklendi`);
};
