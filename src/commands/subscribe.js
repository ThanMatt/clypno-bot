import Guild from '../models/Guild'
import { searchTwitchChannel } from '../utils'

module.exports = {
  name: 'subscribe',
  description: "Subscribes twitch channel's clips",
  async execute(message, { twitchChannel }) {
    try {
      const currentGuild = await Guild.findOne({ guildId: message.guild.id })

      if (!twitchChannel) {
        message.channel.send('Please enter a twitch channel name')
      } else {
        const searchedTwitchChannel = await searchTwitchChannel(twitchChannel)

        if (!currentGuild) {
          if (searchedTwitchChannel) {
            const newGuild = new Guild({
              guildId: message.guild.id,
              guildPrefix: '$',
              twitchChannels: [searchedTwitchChannel]
            })
            newGuild.save()
            message.react('✅')
          } else {
            const newGuild = new Guild({
              guildId: message.guild.id,
              guildPrefix: '$'
            })
            newGuild.save()
            message.channel.send('No twitch channel found')
          }
          console.log('New guild joined')
        } else {
          if (searchedTwitchChannel) {
            const currentTwitchChannel = currentGuild.twitchChannels.find(
              (channel) => searchedTwitchChannel.broadcasterId === channel.broadcasterId
            )

            if (currentTwitchChannel) {
              message.channel.send(`You've already subscribed to ${searchedTwitchChannel.displayName}`)
            } else {
              currentGuild.twitchChannels = [searchedTwitchChannel, ...currentGuild.twitchChannels]
              currentGuild.save()
              message.react('✅')
            }
          } else {
            message.channel.send('No twitch channel found')
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
