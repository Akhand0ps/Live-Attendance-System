import  jwt,{JwtPayload} from "jsonwebtoken"
import { Request } from "express"
interface customPayload extends JwtPayload {
  id: string
  role: 'teacher' | 'student'
}


export const authenticateWS = (token:string)=>{
    console.log('camer here')
    console.log(token)
    if (!token) {
        return null
    }
    try{
        const verifyToken = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as customPayload
    
        return {
            id:verifyToken.id,
            role:verifyToken.role
        }
   }catch(err){
    return null
   }
}
