const { Schema, model } = require("mongoose");

const logSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  joinLeaveChannelId: {
    type: String,
    required: false,
  },
  rankChannelId: {
    type: String,
    required: false,
  },
  moderationLogChannelId: {
    type: String,
    required: false,
  },
});

module.exports = model("LogId", logSchema);
