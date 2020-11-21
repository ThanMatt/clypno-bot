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
      },
      broadcasterUrl: {
        type: String,
        required: true
      },
      latestClip: {
        url: {
          type: String,
          default: ''
        },
        creatorName: {
          type: String,
          default: ''
        },
        title: {
          type: String,
          default: ''
        },
        createdAt: {
          type: String,
          default: ''
        }
      }
    }
  ]
})

const Guild = mongoose.model('guild', guildSchema)

export default Guild
