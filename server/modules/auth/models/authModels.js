import { getMongoDB } from "../../../db/mConection.js";
import bcrypt from 'bcrypt'
const Auth = process.env.AUTH_COLLECTION

export class authModels {
    static async CreateUser({username, password}){
        const db = await getMongoDB()
        const collection = db.collection(Auth)
        if(!username || !password){
            return{
                status: 500,
                error: "internal server error"
            }
        }else{
            try{
                const existingUser = await collection.findOne({user: username})
                if(existingUser){
                    return{
                        success: false,
                        error: "Usuario ya existe"
                    }
                }
                let hashPassoword = await bcrypt.hash(password, 10)
                const user = {
                    user: username,
                    password: hashPassoword,
                }
                const result = await collection.insertOne(user)
                if(!result.acknowledged){
                    return{
                        success: false,
                        error: "Error al crear el usuario"
                    }
                }else{
                    return{
                        success: true,
                        message: `Bienvenido ${username}`
                    }
                }
            }catch(err){
                return{
                    status: 500,
                    error: "Internal server error",
                    details: err
                }
            }
        }
    }
    static async loginUser(){}
    static async getUserById(){}
    static async updateUser(){}
    static async deleteUser(){}
}
(async()=>{
    let user = "gabriel"
    let password = 'gabriel123'
    const result = await authModels.CreateUser({user, password})
    console.log(result)
})();