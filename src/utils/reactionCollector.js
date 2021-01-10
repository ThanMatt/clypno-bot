/**
 * @param {object} message - Message object
 * @param {string} emoji - the specific emoji reaction to collect
 * @param {number} seconds - in milliseconds
 */
export const reactionCollector = (message, emoji, seconds) => {
  const collector = message.createReactionCollector(
    (reaction, user) => {
      return reaction.emoji.name === emoji && !user.bot
    },
    { time: seconds }
  )
  return collector
}
