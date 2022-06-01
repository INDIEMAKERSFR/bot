import { InteractionType } from 'discord-interactions'
import { ApplicationCommandInteractionDataOption, Interaction } from '../command'
// import { sendTxtLater } from './utils'
import { userFn } from './user'
import { incomeFn } from './incomes'
import { projectFn } from './project'
import { karmaFn } from './karma'
import { taskFn } from './tasks'
import { postFn } from './post'

const im = (interaction: Interaction, option: ApplicationCommandInteractionDataOption, senderId: string): Promise<any> => {
  try {
    if (option.name === 'karma' && option.options && option.options.length > 0) {
      return karmaFn(interaction, option.options[0], senderId).then(() => ({
        content: "..."
      }))
    }
    if (option.name === 'projet' && option.options && option.options.length > 0) {
      return projectFn(interaction, option.options[0], senderId).then(() => ({
        content: "..."
      }))
    }
    if (option.name === 'post' && option.options && option.options.length > 0) {
      return postFn(interaction, option.options[0], senderId).then(() => ({
        content: "..."
      }))
    }
    if (option.name === 'tache' && option.options && option.options.length > 0) {
      return taskFn(interaction, option.options[0], senderId).then(() => ({
        content: "..."
      }))
    }
    if (option.name === 'revenu' && option.options && option.options.length > 0) {
      return incomeFn(interaction, option.options[0], senderId).then(() => ({
        content: "..."
      }))
    }
    if (option.name === 'maker' && option.options && option.options.length > 0) {
      return userFn(interaction, option.options[0], senderId).then(() => ({
        content: "..."
      }))
    }
    if (option.name === 'doc') {
      return Promise.resolve({ content: `Voici la doc pou m'utiliser ! https://doc.indiemakers.fr` })
    }
    return Promise.resolve({ content: `La Commande ${option.name} n'est pas pris en charge 🤫` })
  } catch (err) {
    console.error('im', err)
    return Promise.resolve({ content: `La Commande ${option.name} a échoué` })
  }
}

const discordInteraction = (interaction: Interaction): Promise<any> => {
  // console.log('discordInteraction', interaction)
  if (interaction && interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data) {
    if (interaction.data.name === 'im' && interaction.data.options && interaction.data.options.length > 0 && interaction.member.user) {
      return im(interaction, interaction.data.options[0], interaction.member.user.id)
    }
    return Promise.resolve({ content: `La Commande ${interaction.data.name} n'est pas pris en charge 🤫` })
  }
  return Promise.resolve({ content: `La Commande n'est pas pris en charge 🤫` })
}

export default discordInteraction
