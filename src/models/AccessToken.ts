import mongoose from 'mongoose'

interface IAccessToken extends mongoose.Document {
  token: string,
  clientId: string,
  userId: string,
  scope: string
}

const AccessToken = new mongoose.Schema({
  token: String,
  clientId: String,
  userId: String,
  scope: String
})

export default mongoose.model<IAccessToken>('AccessToken', AccessToken)