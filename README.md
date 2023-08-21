# Discord Bot (V14)

This bot **connected to MongoDB** and has manuel **caching**(commands, levels, reaction). Bot is capable of automatic **message capturing** and **adding reaction** to captured message, **logging**, **admin/moderation commands**(kick, ban, unban, timeout, untimeout, delete messages in bulk), simple y/n polls, **echo**, random **love meter**(between users), random **beauty meter**, ping, **user avatar**, **user info**, **level/xp**.

**ProTip:** Logging, message reaction and level features **not enabled by default**. You need to **configure it** by **slash command**.

---

## Configuration

You need to configure **.env** and **config.json** file

### .env file

Atleast you must set `TOKEN` and `MONGODB_URI`.

You can find `TOKEN` info from here [here](https://discord.com/developers/applications).
You can find `MONGODB_URI` info from here [here](https://cloud.mongodb.com).

```env
CLIENT_ID=
CLIENT_SECRET=
TOKEN=
GUILD_ID=
MONGODB_URI=
```

### config.json file

> Guild ID and User IDs

```json
{
	"testServer": "",
	"devs": [""]
}
```
