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
		},
		{
			name: "user",
			description: "Owner of the messages that you want to delete",
			type: ApplicationCommandOptionType.User,
			required: false
		}
	],
	permissionRequired: [PermissionFlagsBits.ManageMessages],
	botPermissions: [PermissionFlagsBits.ManageMessages],

	callback: async (client, interaction) => {
		const { channel, options } = interaction;
		const messageCount = options.get("count").value;
		const userID = options.get("user")?.value;

		if (userID) {
			user = await interaction.guild.members.fetch(userID)

			let userMessages = [];
			const messages = await channel.messages.fetch({
				limit: messageCount
			});

			let i = 1;

			while (userMessages.length < messageCount) {
				if (i >= 10) break;

				const messages = await channel.messages.fetch({
					limit: messageCount * i
				});

				i++;
				messages.map((msg) => {
					if (msg.author.id === user.id & !(userMessages.includes(msg))) {
						userMessages.length >= messageCount ? null : userMessages.push(msg)
					}
				});
			}


			if(userMessages.length > 0) {
				channel.bulkDelete(userMessages).then(() => {
					interaction.reply(
						`${user.toString()} kullanıcısının silinen mesaj sayısı: ${userMessages.length}`
					)
				}).catch(() => {
					interaction.reply(
						`${user.toString()} kullanıcısının mesajları silinemiyor`
					)
				})
				
			} else {
				interaction.reply(
					`${user.toString()} kullanıcısına ait mesaj bulunamadı`
				);
			}
			
		} else {
			await channel.bulkDelete(messageCount + 1, true);
			interaction.reply(`Silinen mesaj sayısı: ${messageCount}`);
		}

		// const botMsg = await messages.find(
		//     (msg) => msg.author.id === client.user.id
		// );
		// botMsg.delete();
	}
};
