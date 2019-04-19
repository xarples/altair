import dotenv from 'dotenv'
import ms = require('ms');


dotenv.config()

export default {
  db: {
    host: process.env.DB_HOST || 'localhost',
    dbName: process.env.DB_NAME || 'altair'
  },
  port: process.env.PORT || 3000,
  session: {
    secret: process.env.SECRET || ['secret'],
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: ms('24h')
    }
  },
}