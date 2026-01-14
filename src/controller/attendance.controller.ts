import { Request,Response } from "express";
import { ClassModel } from "../models/class.model";
import { User } from "../models/user.model";
import { Attendance } from "../models/attendance.model";
import { classSchema } from "../schemas/class.schema.";
import da from "zod/v4/locales/da.js";
import { success } from "zod";




export const myattendance = async(req:Request,res:Response):Promise<void>=>{

  // console.log('myatt')
  // console.log("===============================================")
  try{
    const userId = req.user.id;
    const clasId = req.params.id;
    const checkClass = await ClassModel.findById(clasId);
    if(!checkClass){
      res.status(404).json({success:false,error:'Class not found'})
      return;
    }
    
    const checkEnrolled = await ClassModel.findOne({
      studentsIds:{$in:[userId]}
    })

    // console.log(checkEnrolled);

    if(!checkEnrolled){
      res.status(403).json({
        success:false,
        error:'You are not in the class, please contact your professor/admin'
      })
      return;
    }

    /* 
    this is for testing only :)
    const mark = new Attendance({
      classId:clasId,
      studentId:userId,
      status:"present"
    })

    await mark.save(); 
    
    */

    const data = await Attendance.findOne({
      classId:clasId,
      studentId:userId
    }).select({createdAt:0,updatedAt:0,__v:0,_id:0,studentId:0})

    
    // console.log(attendance?.status);

    if(data?.status === null || data === null){
      res.status(200).json({
        success:true,
        message:"attendance not marked yet!",
        data
      })

      return;
    }

    res.status(200).json({success:true,data});
    return;
  }catch(err:unknown){
    if(err instanceof Error){
      res.status(500).json({success:false,error:err.message})
      return;
    }
    else{
      res.status(500).json({success:false})
      return;
    }
  }
}

export const attendanceStart = async(req:Request,res:Response):Promise<void>=>{

  const result = classSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({ success: false, error: 'Invalid request schema', result })
    return
  }
  try{


    const data = await ClassModel.findOne({
      className:result.data.className
    });

    console.log(data);

    if(!data){
        res.status(404).json({
            success:false,
            error:'class not found'
        })
        return;
    }

    const activeSession = {
        classId:data._id,
        startedAt: new Date().toISOString(),
        attendance:{

        }
    }

    //yaha pe ws connect kr aur sesson start kr

    

    res.status(200).json({
      success:true,
      data
    })
    return;

  }catch(err:unknown){
    if(err instanceof Error){
      res.status(500).json({success:false,error:err.message})
      return;
    }
    else{
      res.status(500).json({success:false})
      return;
    }
  }
}