import Guild from '../models/Guild'

module.exports = {
  name: 'remove',
  description: 'Removes subscribed twitch channel',
  async execute(message, { twitchName }) {
    try {
      const currentGuild = await Guild.findOne({ guildId: message.guild.id })

      if (!twitchName) {
        message.channel.send('Please enter a twitch channel name')
      } else {
        if (!currentGuild) {
          const newGuild = new Guild({
            guildId: message.guild.id,
            guildPrefix: '$'
          })
          newGuild.save()
          console.log('New guild joined')
          message.channel.send(`${twitchName} not found`)
        } else {
          const twitchChannel = currentGuild.twitchChannels.find(
            ({ displayName }) => displayName.toLowerCase() === twitchName
          )

          if (twitchChannel) {
            currentGuild.twitchChannels = currentGuild.twitchChannels.filter(
              ({ displayName }) => displayName.toLowerCase() !== twitchName
            )
            currentGuild.save()
            message.react('✅')
          } else {
            message.channel.send(`${twitchName} not found`)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
