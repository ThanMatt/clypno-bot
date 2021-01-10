import { CMD_HELP } from '../utils/constants'
module.exports = {
  name: CMD_HELP,
  description: 'Send help command',
  execute(message, { prefix, commands }) {
    const tips = commands.map((command) => {
      if (command.arguments) {
        return `**${prefix}${command.name}** \`${command.arguments}\` \n${command.description}`
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
