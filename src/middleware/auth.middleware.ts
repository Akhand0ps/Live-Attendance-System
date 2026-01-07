import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface customPayload extends JwtPayload {
  id: string
  role: 'teacher' | 'student'
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]

    console.log(token)
    if (!token) {
      res.status(404).json({ success: false, error: 'please send jwt token' })
      return
    }

    const verifytoken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as customPayload
    if (!verifytoken) {
      res
        .status(401)
        .json({
          success: false,
          error: 'Unauthorized, token missing or invalid',
        })
    }

    req.user = {
      id: verifytoken.id,
      role: verifytoken.role,
    }

    next()
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, error: err.message })
    } else console.log('err came in authroize')
  }
}
