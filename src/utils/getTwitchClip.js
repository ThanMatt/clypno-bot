import { axios } from '../config'
/**
 * @param {String} broadcasterId
 */
export const getTwitchClip = async (broadcasterId) => {
  try {
    const { data } = await axios.get(`/clips?broadcaster_id=${broadcasterId}&first=3`)
    const response = data.data

    if (response.length) {
      return {
        url: response[0].url,
        creatorName: response[0].creator_name,
        title: response[0].title,
        createdAt: response[0].created_at
      }
    }
    return {}
  } catch (error) {
    throw error
  }
}
