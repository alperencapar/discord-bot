const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	Client,
	Interaction,
} = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")

module.exports = {
	name: "delete",
	description: "Delete messages",
	options: [
		{
			name: "count",
			description:
				"Number of message you want to delete(max number is 99)",
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
		{
			name: "user",
			description: "Owner of the messages that you want to delete",
			type: ApplicationCommandOptionType.User,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.ManageMessages],
	botPermissions: [PermissionFlagsBits.ManageMessages],

	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	callback: async (client, interaction) => {
		try {
			const { channel, options } = interaction
			let messageCount = options.get("count").value
			const userID = options.get("user")?.value

			if (messageCount > 100) messageCount = 99

			if (userID) {
				user = await interaction.guild.members.fetch(userID)

				let userMessages = []
				const messages = await channel.messages.fetch({
					limit: messageCount,
				})

				let i = 1

				while (userMessages.length < messageCount) {
					if (i >= 10) break

					if (messageCount * i >= 100) break

					const messages = await channel.messages.fetch({
						limit: messageCount * i,
					})

					i++
					messages.map((msg) => {
						if (
							(msg.author.id === user.id) &
							!userMessages.includes(msg)
						) {
							userMessages.length >= messageCount
								? null
								: userMessages.push(msg)
						}
					})
				}

				if (userMessages.length > 0) {
					channel
						.bulkDelete(userMessages)
						.then(async () => {
							await interaction.reply(
								`${user.toString()} kullanıcısının silinen mesaj sayısı: ${
									userMessages.length
								}`
							)
						})
						.catch(async () => {
							await interaction.reply(
								`${user.toString()} kullanıcısının mesajları silinemiyor`
							)
						})
				} else {
					await interaction.reply(
						`${user.toString()} kullanıcısına ait mesaj bulunamadı`
					)
				}
			} else {
				await channel.bulkDelete(messageCount, true)
				await interaction.reply(`Silinen mesaj sayısı: ${messageCount}`)
			}

			setTimeout(() => {
				interaction.editReply(
					"Birkaç saniye sonra bu mesaj kendini yok edecek!"
				)
			}, 4000)

			setTimeout(() => {
				interaction.deleteReply()
			}, 8000)
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}

		// const botMsg = await messages.find(
		//     (msg) => msg.author.id === client.user.id
		// );
		// botMsg.delete();
	},
}
