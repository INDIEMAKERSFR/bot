import type { Handler } from '@netlify/functions'
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions'
import initF from '../services/firebase/init'
import discordInteraction from '../services/discord/bot'

export const handler: Handler = async(event) => {
  console.error('bot')
  initF()
  try {
    const signature = String(event.headers ? event.headers['x-signature-ed25519'] : '')
    const timestamp = String(event.headers ? event.headers['x-signature-timestamp'] : '')
    const rawBody = String(event.body).replace(/'/g, '\'').replace(/\\'/g,"'")
    const isValidRequest = await verifyKey(rawBody as string, signature, timestamp, String(process.env.CLIENT_PUBLIC_KEY))
    if (!isValidRequest) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify("Bad request signature")
      }
    }
    const body = JSON.parse(event.body || '{}')
    if (event.body && body.type === InteractionType.APPLICATION_COMMAND && body.data) {
      try {
        const data = await discordInteraction(body)
        console.log('data', data)
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              type: InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE,
              data
          })
        }
      } catch (e) {
        console.error('bot', e)
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Error bot",
            error: e
          })
        }
      }
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: InteractionResponseType.PONG,
      })
    }
  } catch (error: any) {
    console.error(error.message)
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Error bot",
        error: error.message
      })
    }
  }
};