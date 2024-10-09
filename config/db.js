import mongoose, { connect }  from "mongoose";
import url from './serverConfig.js'
export const dbConnect = async()=>{
    try{
    
        await mongoose.connect(url.url)
        console.log("connected")

    }
    catch(err){
        
        console.log("error",err)
    }

}
export default dbConnect;