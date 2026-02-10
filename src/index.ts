import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'
import { connectDb } from './config/db.config'
const uri = process.env.uri
import expressWs from "express-ws";
import { WebSocketServer } from 'ws'
import http from "http"
import {parse} from 'url'
import { authenticateWS } from './middleware/ws.middleware.js'
import { attendanceZod } from './schemas/attendance.schema.js'
import { success } from 'zod'
import { error } from 'console'

const PORT = process.env.PORT


const server = http.createServer(app);

const wss = new WebSocketServer({noServer:true});


let activeSession = {
  classId: "",
  startedAt:"",
  attendance:{

  }

}

server.on('upgrade',(req,socket,head)=>{
    const {token} = parse(req.url || '',true).query;
    //@ts-ignore
    const auth = authenticateWS(token);

    if(!auth){
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
    //@ts-ignore
    req.user = auth;

    wss.handleUpgrade(req,socket,head,connection=>{
      wss.emit('connection',connection,req);
    })
})

wss.on('connection', (ws,req)=>{
  console.log('Connected to ws');
  //@ts-ignore
  ws.user = req.user
  //@ts-ignore
    console.log("ws user ", ws.user);

    ws.on('message',async (message)=>{
      //@ts-ignore
      const parsedMsg = JSON.parse(message);
      const result = attendanceZod.safeParse(parsedMsg);
      if(!result.success){
        console.log('invalid msg schema',result);
      
        ws.send(JSON.stringify({

          success:false,
          error:'Invalid msg schema'
        }))
      }

      console.log(result.data);
      if(result.data?.event === 'ATTENDANCE_MARKED'){
        //@ts-ignore
        if(ws.user.role != 'teacher'){
          
          ws.send(JSON.stringify({
            success:false,
            error:'You are not allowed'
          }))
        }

        
        




      }



    })


     ws.on('close', function close() {
        console.log('Client disconnected.')
    })
})

connectDb(uri!)
  .then(() => {

    server.listen(PORT, () => {
      console.log(`server running on PORT ${PORT}`)
    })
    
    // expressWs(app,server)
    
  })
  .catch((err) => {
    console.error('err came while connecting to db and starting server')
  })


