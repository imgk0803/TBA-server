import jwt from 'jsonwebtoken'
import serverConfig from '../config/serverConfig.js'
const key = serverConfig.key

const generateToken = async (email,role)=>{
   try{
    if(role === 'admin'){
        return jwt.sign({email:email , role : role},  
           key, { 
                expiresIn: '1d'
            }); 
        
    }
    else if(role === 'manager'){
        return jwt.sign({email:email , role : role},  
            key, { 
                 expiresIn: "1d" 
             }); 
        
    }
    else{
        return jwt.sign({email:email , role : role},  
            key, { 
                 expiresIn: "1d"
             }); 
         
    }

   }
   catch(err){
            console.log('error::',err)
            res.status(500).send("error")
   }
}
export default generateToken