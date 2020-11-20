import axios from 'axios'

export default axios.create({
  baseURL: process.env.API_SOURCE,
  headers: {
    Authorization: `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
    'Client-ID': process.env.TWITCH_CLIENT_ID
  }
})
