
import { Request } from "express";


export const wsRole = async(req:Request):Promise<Boolean>=>{

    if(req.user.role ==='student'){
        
        return false
    }
    return true
}
