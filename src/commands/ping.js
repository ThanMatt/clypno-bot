module.exports = {
  name: 'ping',
  description: 'First command',
  execute(message) {
    message.channel.send('pong')
  }
}
