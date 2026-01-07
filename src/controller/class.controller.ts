import { Request, Response } from 'express-serve-static-core'
import { classSchema } from '../schemas/class.schema.'
import { User } from '../models/user.model'
import { ClassModel } from '../models/class.model'

export const classPost = async (req: Request, res: Response): Promise<void> => {
  const result = classSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: 'Invalid request schema' })
    return
  }
  try {
    const teacherId = req.user.id
    const teacher = await User.findById(teacherId)
    if (!teacher) {
      res.status(500).json({ success: false, error: 'Teacher not found' })
      return
    }

    const data = new ClassModel({
      className: result.data.className,
      teacherId,
      studentsIds: [],
    })

    await data.save()

    console.log('Data: ', data)

    res.status(201).json({ success: true, data })
    return
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' })
      return
    } else {
      console.log('err came in post-class')
    }
  }
}
