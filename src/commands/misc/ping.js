module.exports = {
	name: "ping",
	description: "Shows bot and user ping",
	// devOnly: Boolean,
	// testOnly: Boolean,
	// options :

	callback: async (client, interaction) => {
		interaction.deferReply();
		const reply = await interaction.fetchReply();
		const ping = reply.createdTimestamp - interaction.createdTimestamp;

		interaction.editReply(
			`Bot Ping: ${ping}ms. | Websocket: ${client.ws.ping}ms`
		);
	}
};
