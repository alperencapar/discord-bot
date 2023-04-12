const { Schema, model } = require("mongoose");

const guildInfoSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
});

module.exports = model("GuildInfo", guildInfoSchema);
