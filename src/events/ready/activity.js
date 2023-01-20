const { ActivityType, PresenceUpdateStatus } = require("discord.js");
const getRandomNumber = require("../../utils/getRandomNumber");
module.exports = async (client) => {
    
    const presenceOptions = [
        {
            name: "Visual Studio Code",
            status: "dnd",
            type: ActivityType.Playing,
        },
        {
            name: "Spotify",
            status: "dnd",
            type: ActivityType.Listening,
        },
        {
            name: "Canlı",
            type: ActivityType.Streaming,
            url: "https://www.twitch.tv/drleventbatu"
        },
        {
            name: "Twitch",
            status: "dnd",
            type: ActivityType.Watching,
        },
    ];



    randomOption = getRandomNumber(presenceOptions.length)
    await client.user.setPresence({ status: presenceOptions[randomOption].status, activities: [presenceOptions[randomOption]] });

	setInterval(async () => {
        randomOption = getRandomNumber(presenceOptions.length)
        await client.user.setPresence({ status: presenceOptions[randomOption].status, activities: [presenceOptions[randomOption]] });
	}, 10000);
}