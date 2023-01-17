require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
	{
		name: "info",
		description: "Info about the user",
		options: [
			{
				name: "user",
				description: "Tag user or user id",
				type: ApplicationCommandOptionType.User,
				required: true
			}
		]
	},

	{
		name: "avatar",
		description: "Show user profile photo",
		options: [
			{
				name: "user",
				description: "Tag user or user id",
				type: ApplicationCommandOptionType.User,
				required: true
			}
		]
	}
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID,
				process.env.GUILD_ID
			),
			{ body: commands }
		);

		console.log("Commands registered successfully");
	} catch (error) {
		console.log(`Error at register-commands: ${error}`);
	}
})();

const rest2 = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID,
				process.env.GUILD_ID2
			),
			{ body: commands }
		);

		console.log("Commands registered successfully");
	} catch (error) {
		console.log(`Error at register-commands: ${error}`);
	}
})();
