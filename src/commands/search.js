import Discord from 'discord.js'
import { reactionCollector, searchTwitchChannel } from '../utils'
import Guild from '../models/Guild'
import { CMD_CHANNEL } from '../utils/constants'

module.exports = {
  name: CMD_CHANNEL,
  description: 'Searches twitch channel',
  arguments: 'twitch_channel',
  async execute(message, { twitchName }) {
    try {
      if (twitchName.length <= 2) {
        message.channel.send('Please enter at least 3 characters')
      } else {
        const searchedTwitchChannel = await searchTwitchChannel(twitchName)

        if (searchedTwitchChannel) {
          console.log(searchedTwitchChannel)
          const emoji = '💗'
          const embedMessage = new Discord.MessageEmbed()
            .setColor('#7b6357')
            .setTitle(searchedTwitchChannel.displayName)
            .setURL(searchedTwitchChannel.broadcasterUrl)
            .setThumbnail(searchedTwitchChannel.profileImage)
            .setDescription(searchedTwitchChannel.description)

          message.channel.send(embedMessage).then((sentEmbed) => {
            sentEmbed.react(emoji)
            reactionCollector(sentEmbed, emoji, 25000).on('collect', async (_, user) => {
              if (!user.bot) {
                const currentGuild = await Guild.findOne({
                  guildId: message.guild.id
                })
                const twitchChannel = {
                  broadcasterId: searchedTwitchChannel.broadcasterId,
                  latestClip: searchedTwitchChannel.latestClip,
                  displayName: searchedTwitchChannel.displayName,
                  broadcasterUrl: searchedTwitchChannel.broadcasterUrl
                }

                if (currentGuild) {
                  const currentTwitchChannel = currentGuild.twitchChannels.find(
                    (channel) => channel.broadcasterId === searchedTwitchChannel.broadcasterId
                  )

                  if (currentTwitchChannel) {
                    message.channel.send(`This server has been already subscribed to ${twitchChannel.displayName}`)
                  } else {
                    currentGuild.twitchChannels = [twitchChannel, ...currentGuild.twitchChannels]
                    currentGuild.save()
                    message.channel.send(`Server subscribed to ${twitchChannel.displayName}`)
                  }
                } else {
                  const newGuild = new Guild({
                    guildId: guild.id,
                    twitchChannels: [twitchChannel]
                  })
                  newGuild.save()
                  message.channel.send(`Server subscribed to ${twitchChannel.displayName}`)
                }
              }
            })
          })
        } else {
          message.channel.send('No twitch channel found :(')
        }
      }
    } catch (error) {
      message.channel.send('There was an error. Please try again')
      throw error
    }
  }
}
