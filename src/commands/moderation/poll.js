const {
    EmbedBuilder,
	ApplicationCommandOptionType,
	PermissionFlagsBits
} = require("discord.js");

module.exports = {
	name: "poll",
	description: "Make a simple poll",
	options: [
		{
			name: "description",
			description: "Description of poll",
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "channel",
			description: "Channel that you want to display poll(if not provided, will published at the current channel)",
			type: ApplicationCommandOptionType.Channel,
			required: false
		}
	],
	permissionRequired: [PermissionFlagsBits.ManageMessages],
	botPermissions: [PermissionFlagsBits.ManageMessages],

	callback: async (client, interaction) => {
		const { channel, options } = interaction;
		const descriptionOfPoll = options.get("description").value;
		const channelID = options.get("channel")?.value;

        await interaction.deferReply({ ephemeral: true })

        const userAvatar = interaction.user.displayAvatarURL({
            format: "jpg",
            size: 1024
        });

        let postChannel
        if(channelID) {
            postChannel = await interaction.guild.channels.fetch(channelID)
        } else {
            postChannel = channel
        }


        const pollEmbed = {
            color: 0x0099ff,
            title: 'Anket!',
            author: {
                name: `${interaction.user.username}#${interaction.user.discriminator}`,
                icon_url: userAvatar,
            },
            description: descriptionOfPoll,
            timestamp: new Date().toISOString(),
            footer: {
                icon_url: userAvatar,
            },
        };
        

        await interaction.editReply({
            content: `Anket ${postChannel.toString()} kanalında oluşturuldu`,
            ephemeral: true
        })
        const poll = await postChannel.send({embeds: [pollEmbed]})
        await poll.react("✅")
        await poll.react("❌")
		
	}
};
