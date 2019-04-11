import { Strategy as LocalStrategy } from 'passport-local'
import { BasicStrategy } from 'passport-http'
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password'
import * as models from '../models'

export const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await models.User.findOne({ username }).exec()

    if (!user) return done(null, false)
    if (user.password !== password) return done(null, false)

    return done(null, user)
  } catch (e) {
    return done(e);
  }
})

export const basicStrategy = new BasicStrategy(async (clientId, clientSecret, done) => {
  try {
    const client = await models.Client.findOne({ clientId }).exec()

    if (!client) return done(null, false)
    if (client.clientSecret !== clientSecret) return done(null, false)

    return done(null, client)
  } catch (e) {
    return done(e);
  }
})

export const clientPasswordStrategy = new ClientPasswordStrategy(async (clientId, clientSecret, done) => {
  try {
    const client = await models.Client.findOne({ clientId }).exec()

    if (!client) return done(null, false)
    if (client.clientSecret !== clientSecret) return done(null, false)

    return done(null, client)
  } catch (e) {
    return done(e);
  }
})


export function serializeUser (user: any, done: Function) {
  done(null, user.username)
}

export async function deserializeUser (username: string, done: Function) {
  try {
    const user = await models.User.findOne({ username }).exec()
    done(null, user)
  } catch (e) {
    done(e)
  }
}