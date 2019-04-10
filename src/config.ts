import dotenv from 'dotenv'

dotenv.config()

export default {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME
  }
}