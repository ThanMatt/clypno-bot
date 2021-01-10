import mongoose from 'mongoose'
import Discord from 'discord.js'
import fs from 'fs'
import Guild from './models/Guild'
import { notifyIfUpdated } from './utils'
import { CMD_HELP, CMD_SUBSCRIBE, CMD_LIST, CMD_REMOVE, CMD_PREFIX, CMD_SET, CMD_CHANNEL } from './utils/constants'

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  reconnectTries: 30,
  reconnectInterval: 500
})

mongoose.connection.once('open', () => {
  console.log('MongoDB connection: Success')
})

client.on('ready', () => {
  console.log(`${client.user.tag} connection: Success`)
})

setInterval(() => {
  notifyIfUpdated(client)
}, 10000)

client.on('message', async (receivedMessage) => {
  const { content, guild, author } = receivedMessage

  try {
    if (guild) {
      const currentGuild = await Guild.findOne({ guildId: guild.id })

      if (!currentGuild) {
        if (author === client.user) {
          return
        }
        if (content.startsWith('$')) {
          processCommand(receivedMessage)
        }
      } else {
        if (author === client.user) {
          return
        }

        const guildPrefix = currentGuild.guildPrefix
        if (content.startsWith(guildPrefix)) {
          processCommand(receivedMessage)
        }
      }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
})

const processCommand = (receivedMessage) => {
  const fullCommand = receivedMessage.content.substr(1)
  const primaryCommand = fullCommand.split(' ')[0]
  const phTime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Shanghai'
  })

  if (!fullCommand) {
    receivedMessage.channel.send('no command')
  }

  console.log(`[${new Date(phTime)}] ${receivedMessage.author.id} issued ${primaryCommand} command`)
  let twitchName
  let prefix

  switch (primaryCommand) {
    case CMD_SET: // !! set
      client.commands.get(CMD_SET).execute(receivedMessage)
      break
    case CMD_SUBSCRIBE: // !! subscribe
      twitchName = receivedMessage.content.substr(primaryCommand.length + 2)
      client.commands.get(CMD_SUBSCRIBE).execute(receivedMessage, { twitchName })
      break
    case CMD_LIST: // !! list
      client.commands.get(CMD_LIST).execute(receivedMessage)
      break
    case CMD_REMOVE: // !! remove
      twitchName = receivedMessage.content.substr(primaryCommand.length + 2)
      client.commands.get(CMD_REMOVE).execute(receivedMessage, { twitchName: twitchName?.toLowerCase() })
      break
    case CMD_PREFIX: // !! prefix
      if (receivedMessage.guild) {
        prefix = receivedMessage.content.substr(primaryCommand.length + 2)

        if (prefix.length > 1 || prefix.length < 1) {
          receivedMessage.channel.send(`Must be at least one character long`)
        } else {
          client.commands.get(CMD_PREFIX).execute(receivedMessage, { prefix })
        }
      } else {
        client.users.get(receivedMessage.author.id).send(`You're not in a server 😑`)
      }

      break
    case CMD_CHANNEL:
      twitchName = receivedMessage.content.substr(primaryCommand.length + 2)
      client.commands.get(CMD_CHANNEL).execute(receivedMessage, { twitchName })
      break
    case CMD_HELP: // !! help
      prefix = receivedMessage.content[0]
      client.commands.get(CMD_HELP).execute(receivedMessage, { prefix, commands: client.commands })
      break
    default:
      break
  }
}

client.login(process.env.BOT_TOKEN)
