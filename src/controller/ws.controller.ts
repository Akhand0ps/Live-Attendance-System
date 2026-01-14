import dotenv from "dotenv"
dotenv.config();
import {WebSocket ,WebSocketServer} from "ws";
import {Types} from "mongoose"
const PORT = Number(process.env.WSPORT)

/* 
    let date = new Date();
    let ISOstring = date.toISOString()
*/



const wss = new WebSocketServer({
    port:PORT,
})

// type studentId = Types.ObjectId;

// interface IStudent{
//     studentId:studentId
// }

type attendancetype = "present" | 'absent'
interface IAttendance{
    studentId: attendancetype
}

interface IActiceSession{
    classId:string,
    startedAt: string,
    attendance: [IAttendance]

}
const activeSession = {
    
}

wss.on("connection",(socket:WebSocket)=>{

    socket.on('message',(data:unknown)=>{



        console.log(data);
    })

    socket.on('error',(err:unknown)=>{

        console.log(err);
    })
})

