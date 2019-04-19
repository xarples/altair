import mongoose from 'mongoose'

interface IAccessToken extends mongoose.Document {
  token: string,
  clientId: string,
  userId: string,
  scope: string
  expiresIn: number
}

const AccessToken = new mongoose.Schema({
  token: String,
  clientId: String,
  userId: String,
  scope: String,
  expiresIn: Number
})

export default mongoose.model<IAccessToken>('AccessToken', AccessToken)