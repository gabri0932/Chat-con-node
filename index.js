import {app} from "./server/api.js";
import {server} from "./server/api.js";
import  {io}  from "./server/api.js";


const PORT = process.env.PORT || 8000


server.listen(PORT, ()=>{ 
    console.log(`api is working in the port ${PORT}`)
})