import mongoose from 'mongoose'

const AuthorizationCode = new mongoose.Schema({
  code: String,
  clientId: String,
  redirectUri: String,
  userId: String,
  scope: String
})

export default mongoose.model('AuthorizationCode', AuthorizationCode)