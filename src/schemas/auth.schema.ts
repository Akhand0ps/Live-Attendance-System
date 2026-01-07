import * as z from 'zod'

export const authSchema = z.object({
  name: z.string().trim().toLowerCase(),
  email: z.email().trim(),
  password: z.string().min(6),
  role: z.enum(['teacher', 'student']),
})

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(6),
})
