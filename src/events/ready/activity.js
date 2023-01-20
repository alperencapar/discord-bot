const { ActivityType, PresenceUpdateStatus } = require("discord.js");
const getRandomOption = require("../../utils/getRandomOption");

module.exports = async (client) => {
	const presenceOptions = [
		{
			activities: [
				{
					name: "Visual Studio Code",
					type: ActivityType.Playing
				}
			],
			status: "dnd"
		},

		{
			activities: [
				{
					name: "Spotify",
					type: ActivityType.Listening
				}
			],
			status: "dnd"
		},

		{
			activities: [
				{
					name: "Canlı",
					type: ActivityType.Streaming,
					url: "https://www.twitch.tv/drleventbatu"
				}
			]
		},

		{
			activities: [
				{
					name: "Twitch",
					type: ActivityType.Watching
				}
			],
			status: "dnd"
		}
	];

	randomOption = getRandomOption(presenceOptions);
	await client.user.setPresence(randomOption);

	setInterval(async () => {
		randomOption = getRandomOption(presenceOptions);
		await client.user.setPresence(randomOption);
		console.log(randomOption);
	}, 60000);
};
