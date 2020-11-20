import mongoose from 'mongoose'
import Discord from 'discord.js'
import fs from 'fs'

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
  client.user.setActivity('?help', { type: 'PLAYING' })
})

client.on('message', async (receivedMessage) => {
  const { content } = receivedMessage

  if (content.startsWith('-')) {
    processCommand(receivedMessage)
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

  switch (primaryCommand) {
    case 'ping':
      client.commands.get('ping').execute(receivedMessage)
      break

    default:
      break
  }
}

client.login(process.env.BOT_TOKEN)
