import { axios } from '../config'
/**
 * @param {String} searchQuery
 */
export const searchTwitchChannel = async (searchQuery) => {
  try {
    const { data } = await axios.get(`/users?login=${searchQuery}`)
    const response = data.data

    if (response.length) {
      return {
        broadcasterId: response[0].id,
        displayName: response[0].display_name
      }
    }
    return null
  } catch (error) {
    throw error
  }
}
