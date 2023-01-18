// const { EmbedBuilder } = require("@discordjs/builders")
const {
	EmbedBuilder,
	ApplicationCommandOptionType,
	AttachmentBuilder
} = require("discord.js");

module.exports = {
	name: "info",
	description: "Info about the user",
	options: [
		{
			name: "user",
			description: "Tag user or user id",
			type: ApplicationCommandOptionType.User,
			required: true
		}
	],

	callback: async (client, interaction) => {
		const credential = interaction.options.get("user");
		const full_username = `${credential.user.username}#${credential.user.discriminator}`;
		const user_avatar_url = credential.user.displayAvatarURL({
			format: "jpg",
			size: 4096
		});

		// if user has roles, return roles, if not roles is equal to "None"
		let roles =
			credential.member._roles.length > 0
				? credential.member._roles
						.map((role) => `<@&${role}>`)
						.join("\n")
				: "None";

		const guild_join_date = new Date(
			credential.member.joinedTimestamp
		).toLocaleString("tr-tr", {
			timeZone: "Turkey"
		});

		const discord_join_date = credential.user.createdAt.toLocaleString(
			"tr-tr",
			{
				timeZone: "Turkey"
			}
		);

		const embed = new EmbedBuilder()
			.setTitle("Kullanıcı Bilgileri")
			.setAuthor({
				name: full_username,
				iconURL: user_avatar_url
			})
			.setTimestamp()
			.setThumbnail(user_avatar_url)
			.addFields(
				{
					name: "Discord Üyelik Tarihi",
					value: `${discord_join_date}`,
					inline: true
				},
				{
					name: "Sunucu Giriş Tarihi",
					value: `${guild_join_date}`,
					inline: true
				},
				{
					name: "Roller",
					value: roles,
					inline: false
				}
			)
			.setFooter({ text: `User ID: ${credential.user.id}` });

		interaction.reply({ embeds: [embed] });
	}
};
