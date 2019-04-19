import mongoose from 'mongoose'

interface IRefreshToken extends mongoose.Document {
  token: string,
  clientId: string,
  userId: string,
  scope: string
}

const RefreshToken = new mongoose.Schema({
  token: String,
  clientId: String,
  userId: String,
  scope: String,
})

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshToken)