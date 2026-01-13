import { Request, Response } from 'express'
import { addStudentSchema, classSchema } from '../schemas/class.schema.'
import { User } from '../models/user.model'
import { ClassModel } from '../models/class.model'
import { Types } from 'mongoose'
import da from 'zod/v4/locales/da.js'
import { success } from 'zod'

export const createClass = async (req: Request, res: Response): Promise<void> => {
  const result = classSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: 'Invalid request schema',result })
    return
  }
  try {
    const teacherId = req.user.id
    const className = result.data.className;
    const teacher = await User.findById(teacherId)
    if (!teacher) {
      res.status(500).json({ success: false, error: 'Teacher not found' })
      return
    }

    const checkClass = await ClassModel.find({className});
    if(checkClass){
      res.status(409).json({
        success:false,
        error:'class already exist'
      })
    }

    const data = new ClassModel({
      className: className,
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

export const addStudent = async(req:Request,res:Response):Promise<void>=>{


  const result =  addStudentSchema.safeParse(req.body);

  // console.log(result);
  if(!result.success){
    res.status(400).json({success:true,error: 'Invalid request schema'})
  }

  const classId = req.params.id!;


  try{
    const studentId = result.data?.studentId;

    const student = await User.findById(studentId);
    if(!student){
      res.status(404).json({
        "success": false,
        "error": "Student not found"
      })
      return;
    }
    const ExistingClass = await ClassModel.findById(classId);
    if(!ExistingClass){
      res.status(404).json({
        "success": false,
        "error": "Class not found"
      })
      return;
    }
    
    // console.log
    const studentIdObj = new Types.ObjectId(studentId);

    const data = await ClassModel.find({studentsIds: {$in:[studentIdObj]}})

    if(data.length >0){
      res.status(409).json({
        success:false,
        error:'student already exist in class'
      })
      return;
    }
    ExistingClass.studentsIds.push(studentIdObj);
    await ExistingClass.save();
    res.status(201).json({success:true,ExistingClass})
    return;

  }catch(err:unknown){
    if(err instanceof Error){

      res.status(500).json({success:false,error:err.message});
    }
  }
}

export const getclassdetails = async(req:Request,res:Response):Promise<void>=>{

  const classId = req.params.id;
  try{
    //teacher who own the class OR student enrolled in class
    const ExistingClass = await ClassModel.findById(classId);

    if(!ExistingClass){
      res.status(404).json({
        "success": false,
        "error": "Class not found"
      })
      return;
    }
    // console.log(ExistingClass);

    const userId = req.user.id;
    // console.log("userId: ",userId);

    const checkUser = await ClassModel.findOne({teacherId:userId}).populate("studentsIds");

    // console.log(checkUser);
    if(checkUser){
      console.log("teacher: ",checkUser);
      res.status(200).json({success:true,checkUser});
      return;
    }
    else{

      
    }
    res.status(200).json({success:true});
    return;
    

  }catch(err:unknown){

    if(err instanceof Error){
      res.status(500).json({
        success:false,
        error:err.message
      })
    }
  }
    
}