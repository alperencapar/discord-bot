const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
} = require("discord.js");

module.exports = {
	name: "role-button",
	description: "give role to user(test)",
	options: [
		{
			name: "channel",
			description: "Channel to send role buttons",
			type: ApplicationCommandOptionType.Channel,
			required: true
		},
		{
			name: "role1",
			description: "Role",
			type: ApplicationCommandOptionType.Role,
			required: true
		},
		{
			name: "role2",
			description: "Role",
			type: ApplicationCommandOptionType.Role,
			required: false
		},
		{
			name: "role3",
			description: "Role",
			type: ApplicationCommandOptionType.Role,
			required: false
		},
		{
			name: "role4",
			description: "Role",
			type: ApplicationCommandOptionType.Role,
			required: false
		},
		{
			name: "role5",
			description: "Role",
			type: ApplicationCommandOptionType.Role,
			required: false
		}
	],

	permissionRequired: [PermissionFlagsBits.ManageRoles],
	botPermissions: [PermissionFlagsBits.ManageRoles],


	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	callback: async (client, interaction) => {
		interaction.deferReply()
		const reply = await interaction.fetchReply()
		
		try {
			const allOptions = interaction.options._hoistedOptions;

            let optionArr = [];
			allOptions.map(async (option) => {
				if (option.value) {
					try {
                        if(option.name === "channel") {
							const { name, value } = option
                            optionArr.push({ name, value });
                        } else {
                            const { id, name } = await interaction.guild.roles.fetch(option.value);
							optionArr.push({ id, name });
							
                        }
					} catch (error) {
						console.log(`Error at allOptions \n\nError: ${error}`);
					}
				}
			});
			// console.log(message.guild.roles)
			
            const channel = await client.channels.cache.get(optionArr[0].value);
			optionArr.shift(); //remove first element.(channel)

			if (!channel) return;

			const row = new ActionRowBuilder();
			optionArr.map((role) => {
				row.components.push(
					new ButtonBuilder()
						.setCustomId(role.id)
						.setLabel(role.name)
						.setStyle(ButtonStyle.Primary)
				);
			});

			await channel.send({
			    content: "Rol almak ya da rol kaldırmak için butona tıklayabilirsin",
			    components: [row]
			})
			interaction.editReply(`${channel.toString()} kanalına rol butonları gönderildi`)

		} catch (error) {
			console.log(`There is error at giveRole.\nError: ${error}`);
			interaction.editReply(`İşlem gerçekleştirilemedi!`)
		}


		const deleteInteractionReplyTimeout = setTimeout(async () => {
			interaction.deleteReply()
			clearTimeout(deleteInteractionReplyTimeout)
		}, 10000);
	}
};
