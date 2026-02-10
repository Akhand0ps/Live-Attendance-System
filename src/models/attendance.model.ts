import {Types,Schema, model} from "mongoose"


type ObjectId = Types.ObjectId
type statusType = "present" | "absent"


interface IAttendance{
    classId:ObjectId,
    studentId:ObjectId,
    status: statusType
    className:string
}


const AttendanceSchema = new Schema<IAttendance>({
    classId:{
        type:Schema.Types.ObjectId,
        ref:"ClassModel",
        required:true
    },
    className:{
        type:String,
        required:true,
        unique:true
    },
    studentId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["present","absent"],
        default:null
    }
},{timestamps:true})


export const Attendance = model<IAttendance>('Attendance',AttendanceSchema)
