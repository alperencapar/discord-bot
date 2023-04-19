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
	 * @returns
	 */

	callback: async (client, interaction) => {
		if (!interaction.inGuild()) return
		const { channel, options } = interaction
		let messageCount = options.get("count").value
		const userID = options.get("user")?.value

		await channel.sendTyping()
		// await interaction.deferReply()

		if (messageCount > 100) messageCount = 99

		try {
			if (userID) {
				user = await interaction.guild.members.fetch(userID)

				let userMessages = []
				let messages
				messages = await channel.messages.fetch({
					limit: messageCount,
				})

				let i = 1

				while (userMessages.length < messageCount) {
					if (messageCount * i >= 99) break
					if (i >= 10) break

					messages = await channel.messages.fetch({
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
						.then(async (msg) => {
							await interaction.reply(
								`${user.toString()} kullanıcısının silinen mesaj sayısı: ${
									msg.size
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
				const deletedMsgCount = await channel.bulkDelete(
					messageCount,
					true
				)
				interaction.reply(
					`Silinen mesaj sayısı: ${deletedMsgCount.size}`
				)
			}

			setTimeout(async () => {
				await interaction.editReply(
					"Birkaç saniye sonra bu mesaj kendini yok edecek!"
				)
			}, 4000)

			setTimeout(async () => {
				await interaction.deleteReply()
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
