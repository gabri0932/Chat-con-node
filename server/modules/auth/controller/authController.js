import { getMongoDB } from "../../../db/mConection.js";
import { authModels } from "../models/authModels.js";
import jwt from "jsonwebtoken"
const AuthKey = process.env.SECRET_KEY 
export class AuthController{

    static async ControllerLogin(req, res){
        const {user, password, rol} = req.body
        if(!user || !password){
            res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }
        
        // if(rol != "Costumer" || rol != "Freelancer"){
        //     res.status(400).json({
        //         status: 400,
        //         message: "Bad request"
        //     })
        // }
        try{
            const findUser = await authModels.getUserByCredentials({username: user, password})
            // console.log(findUser)
            if(!findUser.success){
                res.status(404).json({
                    status: 404,
                    message: "No se encontro el usuario"
                })
            }
            // console.log(findUser)
            const token = jwt.sign({
                id: findUser.data._id,
                name: findUser.data._name,
            }, AuthKey, {expiresIn: '1h'})
            console.log(token)
            res.cookie('TokenAuth', token,{
                httpOnly: false, //acceder tanto desde el servidor como del cliente
                secure: false, //metodos http y https
            })
            return res.status(200).json({
                status: 200,
                user:{
                    id: findUser.data._id,
                    name: findUser.data.user
                }
            })
        }catch(err){
            return res.status(500).json({
                status: 500,
                error: "internal error"
            })
        }
        
    }
    static async ControllerRegister(req, res){   
    }
    static async ControllerLogout(req, res){}

}

(async()=>{

})
