module.exports = {
  name: 'help',
  description: 'Send help command',
  execute(message, { prefix, commands }) {
    const tips = commands.map((command) => {
      if (command.name === 'remove' || command.name === 'subscribe') {
        return `**${prefix}${command.name}** \`twitch_channel\` \n${command.description}`
      }

      if (command.name === 'channel') {
        return `**${prefix}${command.name}** \`discord_channel\` \n${command.description}`
      }

      return `**${prefix}${command.name}** \n${command.description}`
    })
    message.channel.send({
      embed: {
        title: 'Clypno commands',
        description: `
        ${tips.join(`\n\n`)}
        `
      }
    })
  }
}
