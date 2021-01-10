import Guild from '../models/Guild'
import { searchTwitchChannel } from '../utils'
import { CMD_SUBSCRIBE } from '../utils/constants'

module.exports = {
  name: CMD_SUBSCRIBE,
  description: "Subscribes twitch channel's clips",
  arguments: 'twitch_channel',
async execute(message, { twitchName }) {
    try {
      const currentGuild = await Guild.findOne({ guildId: message.guild.id })

      if (!twitchName) {
        message.channel.send('Please enter a twitch channel name')
      } else {
        const searchedTwitchChannel = await searchTwitchChannel(twitchName)

        if (!currentGuild) {
          if (searchedTwitchChannel) {
            const twitchChannel = {
              broadcasterId: searchedTwitchChannel.broadcasterId,
              latestClip: searchedTwitchChannel.latestClip,
              displayName: searchedTwitchChannel.displayName,
              broadcasterUrl: searchedTwitchChannel.broadcasterUrl
            }
            const newGuild = new Guild({
              guildId: message.guild.id,
              guildPrefix: '$',
              twitchChannels: [twitchChannel]
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
              const twitchChannel = {
                broadcasterId: searchedTwitchChannel.broadcasterId,
                latestClip: searchedTwitchChannel.latestClip,
                displayName: searchedTwitchChannel.displayName,
                broadcasterUrl: searchedTwitchChannel.broadcasterUrl
              }
              currentGuild.twitchChannels = [twitchChannel, ...currentGuild.twitchChannels]
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
