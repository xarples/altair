import mongoose from 'mongoose'

interface IUser extends mongoose.Document {
  username: string,
  password: string,
  name: string,
  email: string,
}

const User = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
})

export default mongoose.model<IUser>('User', User)