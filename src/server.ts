import http from 'http'
import express from 'express'
import mongoose, { model } from 'mongoose'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import * as models from './models'
import * as oauth from './oauth'
import * as auth from './passport'
import * as middlewares from './middlewares'
import config from './config'

export const app = express()
const server = http.createServer(app)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret' }))
app.use(passport.initialize())
app.use(passport.session())

passport.use(auth.localStrategy)
passport.use(auth.basicStrategy)
passport.use(auth.clientPasswordStrategy)
passport.serializeUser(auth.serializeUser)
passport.deserializeUser(auth.deserializeUser)

app.get('/clients/save', async (req, res) => {
  const user = new models.User(
    { username: 'bob', password: 'secret', name: 'Bob Smith' },
  )

  const client = new models.Client(
    { name: 'Example app', clientId: 'abc123', clientSecret: 'password', isTrusted: true, redirectUri: 'http://localhost:4000/callback' },
  )

  await user.save()
  await client.save()

  res.send('Saved')
})

app.get('/clients', async (req, res) => {
  const result = await Promise.all([models.User.find(), models.Client.find()])

  res.send(result)
})

app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/authorize', failureRedirect: '/login' }))

app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Altair</title>
    </head>
    <body>
      <form action="/login" method="post">
        <div>
          <label>Username:</label>
          <input type="text" name="username" /><br/>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" />
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
      <p><small>Hint - bob:secret</small></p>
      <p><small>Hint - joe:password</small></p>
    </body>
    </html>
  `)
})

app.get('/authorize', middlewares.isAuthenticated, oauth.authorizeMiddleware, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Altair</title>
    </head>
    
    <body>
      <p>Hi ${req.oauth2.user.name}</p>
      <p><b>${req.oauth2.client.name}</b> is requesting access to your account.</p>
      <p>Do you approve?</p>
    
      <form action="/authorize/decision" method="post">
        <input name="transaction_id" type="hidden" value="${req.oauth2.transactionID}" />
        <div>
          <input type="submit" value="Allow" id="allow" />
          <input type="submit" value="Deny" name="cancel" id="deny" />
        </div>
      </form>
    </body>
    </html>
  `)
})

app.post('/authorize/decision', middlewares.isAuthenticated, oauth.decisionMiddleware)
app.post('/token',
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  oauth.tokenMiddleware,
  oauth.errorHandlerMiddleware
)


if (!module.parent) {
  mongoose.connect(`mongodb://${config.db.host}/${config.db.dbName}`, { useNewUrlParser: true })
  
  server.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`)
  })
}