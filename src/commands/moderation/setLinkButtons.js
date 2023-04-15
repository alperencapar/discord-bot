const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js")

module.exports = {
	name: "link-button",
	description: "Create link buttons(test)",
	options: [
		{
			name: "name1",
			description: "Link",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "link1",
			description: "Link",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "name2",
			description: "Link",
			type: ApplicationCommandOptionType.String,
		},
		{
			name: "link2",
			description: "Link",
			type: ApplicationCommandOptionType.String,
		},
		{
			name: "name3",
			description: "Link",
			type: ApplicationCommandOptionType.String,
		},
		{
			name: "link3",
			description: "Link",
			type: ApplicationCommandOptionType.String,
		},
		// {
		// 	name: "role2",
		// 	description: "Role",
		// 	type: ApplicationCommandOptionType.Role,
		// 	required: false,
		// },
	],
	// deleted: true,

	permissionsRequired: [PermissionFlagsBits.EmbedLinks],
	botPermissions: [PermissionFlagsBits.EmbedLinks],

	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 * @returns
	 */
	callback: async (client, interaction) => {
		try {
			const allOptions = interaction.options._hoistedOptions

			let optionArr = []
			allOptions.map(async (option, index) => {
				try {
					if (option.name.includes("link")) {
						optionArr.push({
							label: allOptions[index - 1].value,
							url: option.value,
							style: ButtonStyle.Link,
						})
					}
				} catch (error) {
					console.log(`Error at allOptions \n\nError: ${error}`)
				}
			})

			const channel = await client.channels.fetch(interaction.channelId)

			if (!channel) return

			const row = new ActionRowBuilder()
			optionArr.map((obj) => {
				row.components.push(
					new ButtonBuilder()
						.setLabel(obj.label)
						.setStyle(obj.style)
						.setURL(obj.url)
				)
			})

			await channel.send({
				components: [row],
			})
			await interaction.reply({ content: `✅`, ephemeral: true })
		} catch (error) {
			console.log(`There is error at giveRole.\nError: ${error}`)
			await interaction.reply({
				content: `İşlem gerçekleştirilemedi!`,
				ephemeral: true,
			})
		}
	},
}
