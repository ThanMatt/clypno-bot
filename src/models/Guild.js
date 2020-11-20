const mongoose = require('mongoose')
const Schema = mongoose.Schema

const guildSchema = new Schema({
  guildId: {
    type: String,
    required: true
  },
  notifiedChannel: {
    type: String,
    default: ''
  },
  guildPrefix: {
    type: String,
    required: true
  },
  twitchChannels: [
    {
      broadcasterId: {
        type: String,
        required: true
      },
      displayName: {
        type: String,
        required: true
      }
    }
  ]
})

const Guild = mongoose.model('guild', guildSchema)

export default Guild
