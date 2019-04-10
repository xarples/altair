import mongoose from 'mongoose'

const AccessToken = new mongoose.Schema({
  token: String,
  clientId: String,
  userId: String,
  scope: String
})

export default mongoose.model('AccessToken', AccessToken)