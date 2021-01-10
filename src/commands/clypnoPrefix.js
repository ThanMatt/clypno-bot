import Guild from '../models/Guild'
import { CMD_PREFIX } from '../utils/constants'

module.exports = {
  name: CMD_PREFIX,
  description: "Changes the bot's prefix",
  arguments: 'prefix',
  async execute(message, { prefix }) {
    try {
      if (message.guild) {
        const guild = await Guild.findOneAndUpdate(
          { guildId: message.guild.id },
          {
            guildPrefix: prefix
          }
        )
        console.log(`Changed prefix into ${prefix}`)
        console.log(guild)
        message.react('✅')
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
