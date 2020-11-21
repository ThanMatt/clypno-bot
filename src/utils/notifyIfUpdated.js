import Guild from '../models/Guild'
import { Client } from 'discord.js'
import { getTwitchClip } from '.'
/**
 * @param {Client} client
 */
export const notifyIfUpdated = async (client) => {
  try {
    const guilds = await Guild.find({})

    if (guilds.length) {
      guilds.forEach((guild) => {
        if (guild.twitchChannels.length && guild.notifiedChannel) {
          guild.twitchChannels.forEach(async (twitchChannel) => {
            const latestClip = await getTwitchClip(twitchChannel.broadcasterId)

            if (latestClip) {
              if (latestClip.createdAt !== twitchChannel.latestClip.createdAt) {
                client.channels.cache.get(guild.notifiedChannel).send(`New clip! ${latestClip.url}`)
                guild.twitchChannels = guild.twitchChannels.map((subscribedChannel) => {
                  if (subscribedChannel.broadcasterId === twitchChannel.broadcasterId) {
                    return {
                      ...subscribedChannel._doc,
                      latestClip
                    }
                  }
                  return subscribedChannel
                })
                guild.save()
              }
            }
          })
        }
      })
    } else {
      return
    }
  } catch (error) {
    throw error
  }
}
