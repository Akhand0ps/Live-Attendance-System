import mongoose, { model, Schema } from 'mongoose'

type roleType = 'teacher' | 'student'

interface IUser {
  name: string
  email: string
  password: string
  role: roleType
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['teacher', 'student'],
    },
  },
  { timestamps: true },
)

export const User = model<IUser>('User', UserSchema)
