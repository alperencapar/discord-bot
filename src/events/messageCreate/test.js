const { Message } = require("discord.js")
const { getRecords } = require("../../handlers/chatCommandCacheHandler")
const repeatingLetterHandler = require("../../handlers/repeatingLetterHandler")
const ChatCommand = require("../../models/ChatCommand")

/**
 *
 * @param {Message} message
 * @returns
 */
module.exports = async (client, message) => {
	if (message.author.bot || !message.inGuild()) return
	if (!message.content.startsWith("!")) return

	const rec = await getRecords(
		ChatCommand,
		{
			guildId: message.guildId,
		},
		"chatCommand"
	)

	// const commandVariables = ["${user}", "${toUser}"]
	const commandVariables = [{ user: "${user}" }, { toUser: "${toUser}" }]

	for (const chatCommand of rec.chatCommand) {
		let sendResponse = false
		let commandAliases

		if (message.content.startsWith(`!${chatCommand.commandName}`)) {
			sendResponse = true
		}

		if (chatCommand?.commandAlias) {
			commandAliases = chatCommand?.commandAlias.trim()
			commandAliases = commandAliases?.split(",")
		}

		if (!sendResponse && chatCommand?.commandAlias) {
			commandAliases.map((alias) => {
				if (message.content.startsWith(`!${alias}`)) {
					sendResponse = true
					return
				}
			})
		}

		if (sendResponse) {
			let commandResponse = chatCommand.commandResponse

			if (commandResponse.includes("${")) {
				for (const variable of commandVariables) {
					if (
						chatCommand.commandResponse.includes(
							variable[Object.keys(variable)]
						)
					) {
						switch (variable[Object.keys(variable)]) {
							case "${user}":
								commandResponse = commandResponse.replace(
									"${user}",
									message.author.toString()
								)

								break
							case "${toUser}":
								const msgContentArr = message.content.split(" ")
								const toUser = msgContentArr.find((txt) =>
									txt.match(/<@[0-9]+>/g)
								)
								console.log(toUser)
								commandResponse = commandResponse.replace(
									"${toUser}",
									toUser
								)
								console.log(commandResponse)

								break

							default:
								break
						}
					}
				}
			}

			// if (chatCommand.commandResponse.includes("${user}")) {
			// 	commandResponse = chatCommand.commandResponse.replace(
			// 		"${user}",
			// 		message.author.toString()
			// 	)
			// }
			message.reply(`${commandResponse}`)
		}
	}
}
