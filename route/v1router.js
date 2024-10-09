import express from "express";
import userRouter from "./userRoute.js";
import adminRouter from "./adminRoute.js";
import managerRouter from "./managerRoute.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { authManager } from "../middleware/authManager.js";
const v1Router = express.Router()
v1Router.use('/admin',authAdmin,adminRouter)
v1Router.use('/user',userRouter)
v1Router.use('/manager',authManager,managerRouter)
export default v1Router