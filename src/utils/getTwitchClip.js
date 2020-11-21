import { axios } from '../config'
/**
 * @param {String} broadcasterId
 */
export const getTwitchClip = async (broadcasterId) => {
  try {
    const { data } = await axios.get(`/clips?broadcaster_id=${broadcasterId}&started_at=${new Date().toISOString()}`)
    const response = data.data

    if (response.length) {
      const latestClip = response.reduce((prev, current) => {
        return prev.created_at > current.created_at ? prev : current
      }, 1)
      return {
        url: latestClip.url,
        creatorName: latestClip.creator_name,
        title: latestClip.title,
        createdAt: latestClip.created_at
      }

      // !! For testing purposes
      // return {
      //   url: response[0].url,
      //   creatorName: response[0].creator_name,
      //   title: response[0].title,
      //   createdAt: response[0].created_at
      // }
    }
    return null
  } catch (error) {
    throw error
  }
}
