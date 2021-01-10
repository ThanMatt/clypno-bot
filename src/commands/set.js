import Guild from '../models/Guild'
import { CMD_SET } from '../utils/constants'

module.exports = {
  name: CMD_SET,
  description: 'Assigns a discord channel for incoming notifications',
  async execute(message) {
    try {
      const currentGuild = await Guild.findOne({ guildId: message.guild.id })

      if (!currentGuild) {
        const newGuild = new Guild({
          guildId: message.guild.id,
          guildPrefix: '$',
          notifiedChannel: message.channel.id
        })
        newGuild.save()
        console.log('New guild joined')
        message.react('✅')
      } else {
        const currentChannel = currentGuild.notifiedChannel
        if (!currentChannel || currentChannel !== message.channel.id) {
          currentGuild.notifiedChannel = message.channel.id
          currentGuild.save()
          message.react('✅')
        } else {
          message.channel.send('This channel has already been set')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
