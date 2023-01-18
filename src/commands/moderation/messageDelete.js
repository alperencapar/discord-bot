const {
	ApplicationCommandOptionType,
	PermissionFlagsBits
} = require("discord.js");

module.exports = {
	name: "delete",
	description: "Delete messages",
	options: [
		{
			name: "count",
			description: "Number of message you want to delete",
			type: ApplicationCommandOptionType.Integer,
			required: true
		}
	],
	permissionRequired: [PermissionFlagsBits.ManageMessages],
	botPermissions: [PermissionFlagsBits.ManageMessages],

	callback: async (client, interaction) => {
		const { channel, options } = interaction;
		const messageCount = options.get("count").value;

		/* 
            const messages = await channel.messages.fetch({
                limit: messageCount + 1
            });

            const botMsg = await messages.find(
                (msg) => msg.author.id === client.user.id
            );
            botMsg.delete();
        */

		await channel.bulkDelete(messageCount + 1, true);
		interaction.reply(`Silinen mesaj sayısı: ${messageCount}`);
	}
};
