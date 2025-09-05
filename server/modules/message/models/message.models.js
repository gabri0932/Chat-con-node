import { getMongoDB } from "../../../db/mConection.js";

const collectionName = process.env.MESSAGES_COLLECTION

export class MessageModels{
    static async createMessage(person, messages){
        try{
            const db = await getMongoDB();
            const collection = db.collection(collectionName)
            const modelsMessage = { 
                user: person,
                message: messages,
                time: Date.now()
            }
            const result = await collection.insertOne(modelsMessage)
            if (!result.acknowledged) {
                return{
                    status: 500,
                    message: "Error creating message",
                    sucess: false
                }
            }else{
                return{
                    status: 201,
                    message: "Message created",
                    sucess: true,
                    data: result
                }
            }

        }catch(error){
            console.error("error creating message: ", error)
        }
    }
}

(async()=>{
    const message = await MessageModels.createMessage("Juan", "Hola, este es otro mensaje de prueba")
    console.log(message)
})()