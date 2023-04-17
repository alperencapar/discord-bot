const { devs, testServer } = require("../../../config.json")
// const buttonInteractionHandler = require("./01buttonInteractionHandler")
const errorFileLogHandler = require("../../handlers/errorFileLogHandler")
const getLocalCommands = require("../../utils/getLocalCommands")

module.exports = async (client, interaction) => {
	if (!interaction.isChatInputCommand()) return

	const localCommands = getLocalCommands()

	try {
		const commandObject = localCommands.find(
			(cmd) => cmd.name === interaction.commandName
		)

		if (!commandObject) return

		if (commandObject?.devOnly) {
			if (!devs.includes(interaction.member.id)) {
				await interaction.reply({
					content:
						"Only developers are allowed to run this command.(command is currently under development/testing stage)",
					ephemeral: true,
				})
				return
			}
		}

		if (commandObject?.testOnly) {
			if (!(interaction.guild.id === testServer)) {
				await interaction.reply({
					content:
						"This command cannot be ran here.(command is currently under development/testing stage)",
					ephemeral: true,
				})
				return
			}
		}

		if (commandObject?.permissionsRequired?.length) {
			for (const permission of commandObject.permissionsRequired) {
				if (!interaction.member.permissions.has(permission)) {
					await interaction.reply({
						content: "You do not have enough permissions.",
						ephemeral: true,
					})
					return
				}
			}
		}

		if (commandObject?.botPermissions?.length) {
			for (const permission of commandObject.botPermissions) {
				const bot = interaction.guild.members.me

				if (!bot.permissions.has(permission)) {
					await interaction.reply({
						content: "I don't have enough permissions.",
						ephemeral: true,
					})
					return
				}
			}
		}

		await commandObject.callback(client, interaction)
	} catch (error) {
		console.log(`There was an error running this command: ${error}`)
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "handleCommands.js")
	}
}
