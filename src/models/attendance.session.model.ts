import { model, Schema, Types } from "mongoose";
import { boolean } from "zod";


type ObjectId = Types.ObjectId

interface IAttendanceSession{
    className:string,
    is_active:Boolean,
    startedAt:string,
    classId: ObjectId
}


const AttendanceSessionSchema = new Schema<IAttendanceSession>({
    className:{
        type:String,
        required:true
    },
    classId:{
        type:Schema.Types.ObjectId,
        ref:"ClassModel"
    },
    is_active:{
        type:boolean,
        required:true,
        default:false
    },
    startedAt:{
        type:String,
        required:true
    },
},{timestamps:true})


export const AttendanceSession = model<IAttendanceSession>('AttedanceSession',AttendanceSessionSchema)