import Guild from '../models/Guild'
import { CMD_LIST } from '../utils/constants'

module.exports = {
  name: CMD_LIST,
  description: 'Lists down the subscribed twitch channels',
  async execute(message) {
    try {
      const currentGuild = await Guild.findOne({ guildId: message.guild.id })

      if (!currentGuild) {
        const newGuild = new Guild({
          guildId: message.guild.id,
          guildPrefix: '$'
        })
        newGuild.save()
        console.log('New guild joined')
        message.channel.send('No subscribed twitch channels')
      } else {
        const twitchChannels = currentGuild.twitchChannels.map((twitchChannel) => twitchChannel.displayName)

        if (twitchChannels.length) {
          message.channel.send({
            embed: {
              title: 'Subscribed Twitch Channels',
              description: `
                ${twitchChannels.join(`\n`)}
              `
            }
          })
        } else {
          message.channel.send('No subscribed twitch channels')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
