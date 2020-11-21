import { axios } from '../config'
import { getTwitchClip } from '.'
/**
 * @param {String} searchQuery
 */
export const searchTwitchChannel = async (searchQuery) => {
  try {
    const { data } = await axios.get(`/users?login=${searchQuery}`)
    const response = data.data

    if (response.length) {
      const latestClip = await getTwitchClip(response[0].id)
      return {
        broadcasterId: response[0].id,
        displayName: response[0].display_name,
        broadcasterUrl: `https://twitch.tv/${response[0].display_name}`,
        latestClip
      }
    }
    return null
  } catch (error) {
    throw error
  }
}
