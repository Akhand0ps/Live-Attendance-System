import { Request, Response, NextFunction } from 'express'
import { success } from 'zod'

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


export const OnlyUser = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  

  if(req.user.role !== 'student'){
    res.status(403).json({success:false,error:'Forbidden, student access required'})
  }
  next();
}