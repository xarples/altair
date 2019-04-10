import http from 'http'
import express from 'express'
import oauth2orize from 'oauth2orize'
import mongoose from 'mongoose'
import * as models from './models'
import * as uitls from './utils'
import config from './config'

const app = express()
const server = http.createServer(app)
const oauth = oauth2orize.createServer()

app.get('/clients', async (req, res) => {
  const docs = await models.Client.find()
  res.status(200).send(docs)
})

app.get('/authorize', (req, res) => {})
app.post('/authorize/decision', (req, res) => {})
app.post('/token', (req, res) => {})


if (!module.parent) {
  main() 
}


function main () {
  mongoose.connect(`mongodb://${config.db.host}/${config.db.dbName}`, {useNewUrlParser: true})

  oauth.grant(oauth2orize.grant.code(async (clientId, redirectUri, user, res, done) => {
    try {
      const code = uitls.getRandomString(16)

      const authCode = new models.AuthorizationCode({
        code,
        clientId,
        redirectUri,
        userId: user.id,
        scope: res.scope
      })

      await authCode.save()

      return done(null, code);
    } catch(e) {
      return done(e)
    }
  }))


  oauth.exchange(oauth2orize.grant.code(async (client, code, redirectUri, res, done) => {
    try {
      const authCode = await models.AuthorizationCode.findOne({ code }).exec()

      if (!authCode) {
        throw new Error('auth code was not found')
      }

      if (client.id !== authCode.clientId) { 
        return done(null)
      }

      if (redirectUri !== authCode.redirectUri) { 
        return done(null)
      }

      const token = uitls.getRandomString(256)

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

  server.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`)
  })
}

export default app