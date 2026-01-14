import * as z from 'zod'
import { Types } from 'mongoose'



export const classSchema = z.object({
  className: z.string().min(3),
})

export const addStudentSchema = z.object({
  studentId: z.string().refine(
    (val) => {
      return Types.ObjectId.isValid(val)
    },
    {
      message: 'Invalid ObjectId',
    },
  ),
})
