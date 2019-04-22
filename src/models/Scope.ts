import mongoose from 'mongoose'

interface IScope extends mongoose.Document {
  name: string,
  description: string,
}

const Scope = new mongoose.Schema({
  name: String,
  description: String,
})

export default mongoose.model<IScope>('Scope', Scope)