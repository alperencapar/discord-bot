const { ActivityType, PresenceUpdateStatus } = require("discord.js");
const getRandomOption = require("../../utils/getRandomOption");

module.exports = async (client) => {
	const presenceOptions = [
		{
			name: "Visual Studio Code",
			status: "dnd",
			type: ActivityType.Playing
		},
		{
			name: "Spotify",
			status: "dnd",
			type: ActivityType.Listening
		},
		{
			name: "Canlı",
			type: ActivityType.Streaming,
			url: "https://www.twitch.tv/drleventbatu"
		},
		{
			name: "Twitch",
			status: "dnd",
			type: ActivityType.Watching
		}
	];

	randomOption = getRandomOption(presenceOptions);
	await client.user.setPresence({
		status: randomOption.status,
		activities: [randomOption]
	});

	setInterval(async () => {
		randomOption = getRandomOption(presenceOptions);
		await client.user.setPresence({
			status: randomOption.status,
			activities: [randomOption]
		});
	}, 100000);
};
