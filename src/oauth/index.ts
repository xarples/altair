import oauth2orize from 'oauth2orize'
import ms from 'ms'
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

oauthServer.exchange(oauth2orize.exchange.code(async (client, code, redirectUri, done) => {
  try {
    const authCode = await models.AuthorizationCode.findOne({ code }).exec()

    if (!authCode) {
      throw new Error('auth code was not found')
    }

    if (client.clientId !== authCode.clientId) {
      return done(null)
    }

    if (redirectUri !== authCode.redirectUri) {
      return done(null)
    }

    let accessToken = new models.AccessToken({
      token: utils.getRandomString(256),
      clientId: authCode.clientId,
      userId: authCode.userId,
      scope: authCode.scope,
      expiresIn: ms('24h')
    })

    let refreshToken = new models.RefreshToken({
      token: utils.getRandomString(256),
      clientId: authCode.clientId,
      userId: authCode.userId,
      scope: authCode.scope,
    })

    accessToken = await accessToken.save()
    refreshToken = await refreshToken.save()

    return done(null, accessToken.token, refreshToken.token, { 
      expires_in: accessToken.expiresIn,
    })
  } catch (e) {
    return done(e)
  }
}))


export const authorizeMiddleware = oauthServer.authorization(async (clientId, redirectUri, done) => {
  try {
    const client = await models.Client.findOne({ clientId }).exec()

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


export const decisionMiddleware = oauthServer.decision((req, done) => {
  if (req.oauth2)  {
    return done(null, { 
      scope: req.oauth2.req.scope,
      state: req.oauth2.req.state
    })
  }
})
export const tokenMiddleware = oauthServer.token()
export const errorHandlerMiddleware = oauthServer.errorHandler()

