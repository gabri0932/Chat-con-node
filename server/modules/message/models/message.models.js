import { getMongoDB } from "../../../db/mConection.js";

const collectionName = process.env.MESSAGES_COLLECTION

export class MessageModels{
    static async createMessage(messages){
        try{
            const db = await getMongoDB();
            const collection = db.collection(collectionName)
            const modelsMessage = { 
                user: null,
                message: messages,
                time: Date.now()
            }
            const result = await collection.insertOne(modelsMessage)
            if (!result.acknowledged) {
                return{
                    status: 500,
                    message: "Error creating message",
                    success: false
                }
            }else{
                return{
                    status: 201,
                    message: "Message created",
                    success: true,
                    data: result
                }
            }

        }catch(error){
            console.error("error creating message: ", error)
        }
    }
    static async getMessages(){
        const db = await getMongoDB()
        try{
            const collection = db.collection(collectionName)
            const document = await collection.find().limit(10).toArray()
            if(!document || document.length === 0){
                return {
                    status: 500,
                    success: false,
                    error: "No se pudo traer los mensajes"
                }
            }else{
                return{
                    status: 200,
                    success: true,
                    data: document
                }
                

            }

        }catch(error){
            return {
                status: 500,
                success: false,
                error: "No se pudo traer los mensajes",
                error: error
            }
        }
}}

// (async()=>{
//     const result = await MessageModels.getMessages()
//     console.log(result)
// })();

