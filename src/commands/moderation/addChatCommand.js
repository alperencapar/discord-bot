const {
	Client,
	CommandInteraction,
	ApplicationCommandOptionType,
} = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const {
	findRecord,
	createRecord,
	findOneAndRemoveRecord,
} = require("../../handlers/dbHandler")
const ChatCommand = require("../../models/ChatCommand")

module.exports = {
	name: "chat-commands",
	description: "Chat commands Twitch like",
	type: ApplicationCommandOptionType.SubcommandGroup,
	options: [
		{
			name: "add",
			description: "Add chat command(twitch like)",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "command-name",
					description: "name of command",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "command-response",
					description: "response when command is triggered",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "command-alias",
					description:
						"trigger command. Seperatted with comma(hi,hello)",
					type: ApplicationCommandOptionType.String,
					required: false,
				},
			],
		},
		{
			name: "delete",
			description: "Delete chat command(twitch like)",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "command-name",
					description: "name of command",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		// console.table(interaction)
		// console.log(interaction.options.get("command-response"))
		const subCommandName = interaction.options.getSubcommand()

		try {
			let commandName
			let commandResponse
			let commandAlias
			let isCommandExist
			switch (subCommandName) {
				case "add":
					commandName = interaction.options.get("command-name").value
					commandResponse =
						interaction.options.get("command-response").value
					commandAlias =
						interaction.options.get("command-alias")?.value

					isCommandExist = await findRecord(ChatCommand, {
						commandName: commandName,
					})

					if (isCommandExist) {
						isCommandExist.commandName = commandName
						isCommandExist.commandResponse = commandResponse
						commandAlias
							? (isCommandExist.commandAlias = commandAlias)
							: isCommandExist.commandAlias

						await isCommandExist.save()
					} else {
						const newCommand = await createRecord(ChatCommand, {
							commandName: commandName,
							commandResponse: commandResponse,
							commandAlias: commandAlias,
						})

						if (!newCommand) {
							console.log("err on creating new command")
						}
					}

					break
				case "delete":
					commandName = interaction.options.get("command-name").value

					let delQuery = {
						commandName: commandName,
					}

					isCommandExist = await findRecord(ChatCommand, delQuery)
					if (isCommandExist) {
						await findOneAndRemoveRecord(ChatCommand, delQuery)
					}
					break

				default:
					break
			}

			await interaction.channel.sendTyping()
			// await interaction.deferReply()

			await interaction.reply(`ok`)
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},
}
