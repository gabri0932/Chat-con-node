import {Router} from "express"
import { AuthController } from "../controller/authController.js"

const authRouter = Router()

authRouter.post('/login', AuthController.ControllerLogin)

export default authRouter;