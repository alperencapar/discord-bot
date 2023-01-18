const { ActivityType } = require("discord.js")
module.exports = (client) => {
    
    const status = [
        {
            name: "VSCODE",
            type: ActivityType.Playing
        },
        {
            name: "Spotify",
            type: ActivityType.Listening
        },
        {
            name: "Twitch",
            type: ActivityType.Streaming,
            url: "https://www.twitch.tv/drleventbatu"
        },
        {
            name: "DCS Simulator",
            type: ActivityType.Watching
        }
    ];

    client.user.setActivity(status[0]);

	setInterval(() => {
		let random = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[random]);
	}, 60000);
}