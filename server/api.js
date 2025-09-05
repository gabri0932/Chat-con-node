import express from "express";
import logger from "morgan"; //morgan es un middleware que nos permite ver las peticiones que llegan al servidor
import { Server } from "socket.io";
import {createServer} from "node:http";


const app = express()
const server = createServer(app); //creamos el servidor http
const io = new Server(server); //creamos el servidor de socket.io, servidor bidireccional
app.use(logger("dev")); //podemos ver las peticiones que llegan al servidor
io.on("connection", (socket) => {
    console.log("a user connected", socket) 

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
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
export default app;
export {server};
export {io};

