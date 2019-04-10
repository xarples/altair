import mongoose from 'mongoose'

interface IAuthorizationCode extends mongoose.Document {
  code: string,
  clientId: string,
  redirectUri: string,
  userId: string,
  scope: string
}

const AuthorizationCode = new mongoose.Schema<IAuthorizationCode>({
  code: String,
  clientId: String,
  redirectUri: String,
  userId: String,
  scope: String
})

export default mongoose.model<IAuthorizationCode>('AuthorizationCode', AuthorizationCode)