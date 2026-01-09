import * as z from 'zod'

export const classSchema = z.object({
  className: z.string().min(3),
})



export const addStudentSchema = z.object({
  studentId: z.string()
})