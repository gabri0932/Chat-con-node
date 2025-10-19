import { ObjectId } from "mongodb";
import { getMongoDB } from "../../../db/mConection.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const Auth = process.env.AUTH_COLLECTION

export class authModels {
    static async CreateUser({username, password, rol}){
        const db = await getMongoDB()
        const collection = db.collection(Auth)
        if(!username || !password){
            return{
                success: false,
                status: 400,
                error: "bad request"
            }
        }else{
            try{
                const existingUser = await collection.findOne({user: username})
                if(existingUser){
                    return{
                        success: false,
                        error: "Nombre de usuario existente"
                    }
                }
                let hashPassword = await bcrypt.hash(password, 10)
                const user = {
                    user: username,
                    password: hashPassword,
                    role: rol ?? null,
                    CreateDate: Date.now(),
                    updateDate: Date.now()

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
                        message: 'Usuario creado correctamente',
                        data: {
                            user: user
                        }
                    }
                }
            }catch(err){
                return{
                    success: false,
                    status: 500,
                    error: "Internal server error",
                    details: err
                }
            }
        }
    }
    static async GetUserById(id){
        const db = await getMongoDB()
        const collection = db.collection(Auth)
        if(!id){
            return{
                success: false,
                status: 403,
                error: "Forbidden"
            }
        }try{
            const findUser = await collection.findOne({_id: new ObjectId(id)})
            
            if(!findUser){
                return{
                    success: false,
                    status: 404,
                    error: "No se encontro al usuario",
                }
            }return{
                success: true,
                status: 200,
                data:{
                    username: findUser.user,
                    password: findUser.password 
                } 
            }

        }catch(error){
            return{
                success: false,
                status: 500,
                details: error 
            }
        }
    }
    static async UpdateUser(id, username){
        const db = await getMongoDB()
        const collection = db.collection(Auth)
        try{
            const result = collection.updateOne(
                {_id: new ObjectId(id)},
                {$set: {
                    user: username,
                }}
            )
            
        }catch(err){
            return{
                success: false,
                message: "Error en el AuthModels.UpdateUser",
                error: err
            }
        }
    }
    static async deleteUser(id){
        const db = await getMongoDB()
        const collection = db.collection(Auth)
        if(!id){
            return{
                success: false,
                message: "El id es necesario para eliminar"
            }
        }
        if(!ObjectId.isValid(id)){
            return{
                success: false,
                status: 400,
                message: "Id inválido"
            }
        }
        try{
            const result = await collection.deleteOne({_id: new ObjectId(id)})
            console.log(result)
            if(!result.acknowledged || result.deletedCount === 0){
                return{
                    success: false,
                    message: "No se encontro el usuario a eliminar"
                }
            }
            return{
                success: true,
                message: "Usuario eliminado correctamente."
            }
        }catch(err){
            return{
                success: false,
                module: "Error en el modulo deleteUser",
                error: err
            }
        }
    }
    static async getUserByCredentials({username, password}){
        const db = await getMongoDB()
        const collection = db.collection(Auth)
        if(!username || !password){
            return{
                success: false,
                Error: "Error en el AuthModel.getUserbyCredentials",
                message: "Faltan crendenciales"
            }
        }
        const user = await collection.findOne({user: username})
        // console.log(user)
        if(!user){
            return{
                success: false,
                error: "No se encontro el usuario",
                message: "Error en el AuthModel.getUserbyCredentials"
            }
        }
        const passowordIsSimilar = await bcrypt.compare(password, user.password)
        if(!passowordIsSimilar){
            return{
                success: false,
                error: "Contraseña incorrecta",
                message: "Error en el AuthModel.getUserbyCredentials"
            }
        }else{
            return{
            success: true,
            message: `Bienvido/a`,
            data: user
        }

    }}
}
// (async ()=>{
//     let username = "Maria"
//     let password = "gabriel1234"
//     const result = await authModels.getUserByCredentials({username, password})
//     console.log(result)
// })();















// (async()=>{
//     let id = "68f0fec8a94f205794a71570"
//     const result = await authModels.deleteUser(id)
//     console.log(result)
// })();
// (async()=>{
//     let username = "Maria"
//     let password = 'gabriel123'
//     const result = await authModels.CreateUser({username, password})
//     console.log(result)
// })();
// (async ()=>{
//     let id = '68f0fec8a94f205794a71570'
//     const result = await authModels.getUserById({id})
//     console.log(result)
// })();