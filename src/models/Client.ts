import mongoose from 'mongoose'

interface IClient extends mongoose.Document {
  clientId: string,
  clientSecret: string,
  name: string,
  isTrusted: boolean
}

const Client = new mongoose.Schema({
  clientId: String,
  clientSecret: String,
  name: String,
  isTrusted: Boolean
})

export default mongoose.model<IClient>('Client', Client)