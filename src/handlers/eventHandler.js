const path = require("path")
const getAllFiles = require("../utils/getAllFiles")
const { checkMissingPermission } = require("./eventPermissionHandler")

module.exports = (client) => {
	const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true)

	for (const eventFolder of eventFolders) {
		const eventFiles = getAllFiles(eventFolder)
		eventFiles.sort((a, b) => a > b)

		const eventName = eventFolder.replace(/\\/g, "/").split("/").pop()

		client.on(eventName, async (...arg) => {
			for (const eventFile of eventFiles) {
				const eventFunction = require(eventFile)
				// there are some events that gives 2 or more parameters. We check it from here and send it to event functions
				// if event has 1 parameter, then send it as it is without inside of array(...)(because of spread)

				if (eventFunction.botPermissions?.length) {
					let execute
					const bot =
						arg?.guild?.members.me || arg[0].guild.members.me

					const missingPermissions = await checkMissingPermission(
						bot,
						eventFunction.botPermissions
					)

					arg.length > 1
						? await eventFunction(client, arg, missingPermissions)
						: await eventFunction(
								client,
								arg[0],
								missingPermissions
						  )
				} else {
					arg.length > 1
						? await eventFunction(client, arg)
						: await eventFunction(client, arg[0])
				}
			}
		})
	}
}
