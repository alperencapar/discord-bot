const {
	Client,
	CommandInteraction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	EmbedBuilder,
} = require("discord.js")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const {
	findRecord,
	createRecord,
	findOneAndRemoveRecord,
	findAndSelect,
} = require("../../handlers/dbHandler")
const ChatCommand = require("../../models/ChatCommand")
const { refreshCache } = require("../../handlers/chatCommandCacheHandler")

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
		{
			name: "list",
			description: "list chat commands",
			type: ApplicationCommandOptionType.Subcommand,
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

		await interaction.channel.sendTyping()

		try {
			const guildId = interaction.guildId
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
						guildId: interaction.guildId,
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
							guildId: interaction.guildId,
							commandName: commandName,
							commandResponse: commandResponse,
							commandAlias: commandAlias,
						})

						if (!newCommand) {
							console.log("err on creating new command")
						}
					}

					await interaction.reply(
						`Komut eklendi! Komut: ${commandName}`
					)

					break
				case "delete":
					commandName = interaction.options.get("command-name").value

					let delQuery = {
						guildId: interaction.guildId,
						commandName: commandName,
					}

					isCommandExist = await findRecord(ChatCommand, delQuery)
					if (isCommandExist) {
						await findOneAndRemoveRecord(ChatCommand, delQuery)
					}

					await interaction.reply(
						`Komut silindi! Komut: ${commandName}`
					)
					break

				case "list":
					const allCommands = await findAndSelect(ChatCommand, {
						guildId: interaction.guildId,
					})

					const embed = new EmbedBuilder({
						color: 0x00ff00,
						description: `Chat Komut Listesi`,
					})

					allCommands.map((command, index) => {
						embed.addFields({
							name: `${index + 1} ${command.commandName}`,
							value: `**Yanıt:** ${
								command.commandResponse
							}\n**Alias:** ${
								command.commandAlias
									? command.commandAlias
									: "-"
							}`,
						})
					})

					await interaction.reply({ embeds: [embed] })
					break

				default:
					break
			}

			await refreshCache(ChatCommand, {}, "chatCommand")
		} catch (error) {
			const ErrFileLocation = __dirname + __filename
			errorFileLogHandler(error, ErrFileLocation, interaction)
		}
	},

	permissionsRequired: [PermissionFlagsBits.ModerateMembers],
	botPermissions: [PermissionFlagsBits.SendMessages],
}
