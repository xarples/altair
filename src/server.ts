import http from 'http'
import express from 'express'
import oauth2orize from 'oauth2orize'
import mongoose from 'mongoose'
import * as uitls from './utils'
import config from './config'

const app = express()
const server = http.createServer(app)
const oauth = oauth2orize.createServer()

app.get('/authorize', (req, res) => {})
app.post('/authorize/decision', (req, res) => {})
app.post('/token', (req, res) => {})

if (!module.parent) {
  mongoose.connect(`mongodb://${config.db.host}/${config.db.dbName}`, {useNewUrlParser: true})

  oauth.grant(oauth2orize.grant.code((clientId, redirectUri, user, res, done) => {
    const code = uitls.getRandomString(16)
  }))

  server.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`)
  })
}

export default app