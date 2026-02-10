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
import { string } from 'zod'

const PORT = process.env.PORT


const server = http.createServer(app);

const wss = new WebSocketServer({noServer:true});

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


