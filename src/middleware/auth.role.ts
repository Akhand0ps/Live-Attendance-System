import { Request, Response, NextFunction } from 'express'
import { success } from 'zod'
import fa from 'zod/v4/locales/fa.js'

export const verifyRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.user.role !== 'teacher') {
    res
      .status(403)
      .json({ success: false, error: 'Forbidden, teacher access required' })
    return
  }
  next()
}
