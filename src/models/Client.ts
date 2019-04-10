import mongoose from 'mongoose'

const Client = new mongoose.Schema({
  clientId: String,
  clientSecret: String,
  name: String,
  isTrusted: Boolean
})

export default mongoose.model('Client', Client)