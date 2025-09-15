import express from "express";
import logger from "morgan"; //morgan es un middleware que nos permite ver las peticiones que llegan al servidor
import { Server } from "socket.io";
import {createServer} from "node:http"; //servidor http nativo de nodejs
import { MessageModels } from "./modules/message/models/message.models.js";
import { Db } from "mongodb";
import { getMongoDB } from "./db/mConection.js";
import { MongoErrorLabel } from "mongodb";
import { corsMiddleware } from "./middleware/corsMiddleware.js";

app.use(corsMiddleware)

const app = express()
const server = createServer(app); //creamos el servidor http
const io = new Server(server, {
    connectionStateRecovery: {}
}); //creamos el servidor de socket.io, servidor bidireccional
app.use(logger("dev")); //podemos ver las peticiones que llegan al servidor
io.on("connection", (socket) => {
    console.log("a user connected") 

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
    socket.on("chat message",async (msg) => {
        let result;
        try{
            result = await MessageModels.createMessage(msg)
        }catch(error){
            console.error(error)
            return;
        }
        io.emit("chat message", msg ) //emitimos el mensaje a todos los clientes conectados
    
    })
    console.log(socket.handshake.auth)
    if(!socket.recovered){
        
        //recuperar todos los mensajes sin conexion
        try{
            const result = (async()=>{
                const result = await MessageModels.getMessages()
                return result
            })
            return result
        }catch(error){
            console.error(error)
        }
    }
});  

app.use(express.json());

// app.get("/", (req,res)=>{ 
//     res.status(200).json({
//         status: 200,
//         message: "Api is working"
//     })
// })
app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/client/index.html"); // Enviar el archivo index.html
});
export {app, server, io}

