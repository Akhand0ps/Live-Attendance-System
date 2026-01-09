import { Request, Response, NextFunction } from 'express'

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