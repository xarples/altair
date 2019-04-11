import oauth2orize from 'oauth2orize'
import * as models from '../models'
import * as utils from '../utils'

export const oauthServer = oauth2orize.createServer()

oauthServer.serializeClient((client, done) => done(null, client.clientId))

oauthServer.deserializeClient(async (clientId, done) => {
  const client = await models.Client.findOne({ clientId }).exec()

  return done(null, client)
})

oauthServer.grant(oauth2orize.grant.code(async (client, redirectUri, user, res, done) => {
  try {
    const code = utils.getRandomString(16)
    const authCode = new models.AuthorizationCode({
      code,
      clientId: client.clientId,
      redirectUri,
      userId: user.id,
      scope: res.scope
    })

    await authCode.save()

    return done(null, code);
  } catch (e) {

    return done(e)
  }
}))


oauthServer.exchange('authorization_code', oauth2orize.exchange.code(async (client, code, redirectUri, done) => {
  try {
    const authCode = await models.AuthorizationCode.findOne({ code }).exec()

    if (!authCode) {
      throw new Error('auth code was not found')
    }

    console.log(authCode.clientId)

    if (client.clientId !== authCode.clientId) {
      return done(null)
    }

    if (redirectUri !== authCode.redirectUri) {
      return done(null)
    }

    const token = utils.getRandomString(256)

    const accessToken = new models.AccessToken({
      token,
      clientId: authCode.clientId,
      userId: authCode.userId,
      scope: authCode.scope
    })

    await accessToken.save()

    return done(null, token)
  } catch (e) {
    return done(e)
  }
}))


export const authorizeMiddleware = oauthServer.authorize(async (clientId, redirectUri, done) => {
  try {
    const client = await models.Client.findOne({ clientId }).exec()

    console.log(client)

    if (!client) { 
      return done(null, false)
    }

    if (client.redirectUri != redirectUri) { 
      return done(null, false)
    }

    return done(null, client, client.redirectUri);
  } catch (e) {
    return done(e)
  }
})


export const decisionMiddleware = oauthServer.decision()
export const tokenMiddleware = oauthServer.token()
export const errorHandlerMiddleware = oauthServer.errorHandler()

