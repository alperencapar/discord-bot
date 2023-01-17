require("dotenv").config();
const {
	Client,
	Events,
	GatewayIntentBits,
	Partials,
	EmbedBuilder,
	AttachmentBuilder,
	ActivityType
} = require("discord.js");

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember,
		Partials.Reaction
	]
});

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
	},
]

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

	c.user.setActivity(status[0])

	setInterval(() => {
		let random = Math.floor(Math.random()* status.length)
		c.user.setActivity(status[random])
	}, 60000)
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;

	// console.log(message)
	console.log(message.author.hexAccentColor)

	if (message.content.includes("gün") || message.content.includes("gece")) {
		let cleared_message_content = "";
		let message_content_arr = message.content.split(" ");

		message_content_arr.map((element) => {
			let temp_arr = [];
			let element_arr = [];
			element_arr = element.split("");

			element_arr.map((letter) => {
				if (temp_arr[temp_arr.length - 1] != letter) {
					temp_arr.push(letter);
				}
			});

			let word = temp_arr.join("");
			cleared_message_content += `${word} `;
		});

		if (cleared_message_content.includes("günaydın")) {
			const emoji = message.guild.emojis.cache.find(
				(emoji) => emoji.name === "sakinle"
			);
			// message.react("☕");
			message.react(emoji);
		}

		if (cleared_message_content.includes("iyi geceler")) {
			message.react("🥛");
		}
	}

	// message.react("😄")
	// const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'sx');
	// message.react(reactionEmoji)
});

client.on("interactionCreate", async (interaction) => {
	// if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "add") {
		const num1 = interaction.options.get("number1").value;
		const num2 = interaction.options.get("number2").value;

		interaction.reply(`${num1 + num2}`);
	}

	if (interaction.commandName === "info") {
		const credential = interaction.options.get("user");
		const full_username = `${credential.user.username}#${credential.user.discriminator}`;
		const user_avatar_url = credential.user.displayAvatarURL({
			format: "jpg",
			size: 4096
		});

		// if user has roles, return roles, if not roles is equal to "None"
		let roles =
			credential.member._roles.length > 0
				? credential.member._roles
						.map((role) => `<@&${role}>`)
						.join("\n")
				: "None";

		const guild_join_date = new Date(
			credential.member.joinedTimestamp
		).toLocaleString("tr-tr", {
			timeZone: "Turkey"
		});

		const discord_join_date = credential.user.createdAt.toLocaleString(
			"tr-tr",
			{
				timeZone: "Turkey"
			}
		);

		const embed = new EmbedBuilder()
			.setTitle("Kullanıcı Bilgileri")
			.setAuthor({
				name: full_username,
				iconURL: user_avatar_url
			})
			.setTimestamp()
			.setThumbnail(user_avatar_url)
			.addFields(
				{
					name: "Discord Üyelik Tarihi",
					value: `${discord_join_date}`,
					inline: true
				},
				{
					name: "Sunucu Giriş Tarihi",
					value: `${guild_join_date}`,
					inline: true
				},
				{
					name: "Roller",
					value: roles,
					inline: false
				}
			)
			.setFooter({ text: `User ID: ${credential.user.id}` });
		// .setDescription()

		/*
		const file = new AttachmentBuilder(
			"./src/attachments/937360255912923156.gif"
		);
		*/
		interaction.reply({ embeds: [embed] });
	}

	if (interaction.commandName === "avatar") {
		const credential = interaction.options.get("user");
		const full_username = `${credential.user.username}#${credential.user.discriminator}`;
		const user_avatar_url = credential.user.displayAvatarURL({
			format: "jpg",
			size: 4096
		});

		const embed = new EmbedBuilder()
			.setTitle("Kullanıcı Profil Fotoğrafı")
			.setAuthor({
				name: full_username,
				iconURL: user_avatar_url
			})
			.setImage(user_avatar_url)
			.setTimestamp()
			.setFooter({ text: `User id: ${credential.user.id}` });

		interaction.reply({ embeds: [embed] });
	}
	
	if (interaction.isButton()) {
		const role = interaction.guild.roles.cache.get(interaction.customId)

		await interaction.deferReply({ ephemeral: true, })

		if (!role) {
			interaction.editReply({
				content: "Rol Bulunamadı",
			})
		}

		const hasRole = interaction.member.roles.cache.has(role.id)
		if (hasRole) {
			await interaction.member.roles.remove(role)
			await interaction.editReply(`${role} rolü kaldırıldı`)
			return;
		}

		await interaction.member.roles.add(role)
		await interaction.editReply(`${role} rolü eklendi`)

	}
});


client.login(process.env.TOKEN);
