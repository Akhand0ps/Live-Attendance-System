import mongoose, { model, Schema, Types } from 'mongoose'

type ObjectId = Types.ObjectId

interface IClass {
  className: string
  teacherId: ObjectId
  studentsIds: ObjectId[]
}

const ClassSchema = new Schema<IClass>(
  {
    className: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentsIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true },
)

export const ClassModel = model<IClass>('ClassModel', ClassSchema)
