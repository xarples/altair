import mongoose from 'mongoose'

interface IClient extends mongoose.Document {
  clientId: string,
  clientSecret: string,
  name: string,
  isTrusted: boolean,
  redirectUri: string,
  scope: string
}

const Client = new mongoose.Schema({
  clientId: String,
  clientSecret: String,
  name: String,
  isTrusted: Boolean,
  redirectUri: String,
  scope: String
})

export default mongoose.model<IClient>('Client', Client)