import User from "../models/user.js";
import createHash from "../utils/createHash.js";
import generateToken from "../utils/userToken.js";
import bcrypt from 'bcrypt'

export const signin= async (req,res,next) => {
try{
    
    const {username,email,password,phone,role} = req.body
    const userexist = await User.findOne({email : email}) 
    if(userexist){
        return res.status(500).send("user is exists")
    }

    const hashedpassword = await createHash(password);   
    const user = new User({
        username,
        email,
        phone,
        password:hashedpassword,
        role
    })
    await user.save()
    const token = await generateToken(user.email,user.role)
    res.cookie('token',token);
    res.status(200).json({user,token,message:'signin successfull'})
    
}
catch(err){
    console.log("error ::" ,err)
    res.status(500).send('not created')
}
}
export const createManager = async (req,res,next) => {
    try{
        
        const {username,email,password,phone,role} = req.body
        const userexist = await User.findOne({email : email}) 
        if(userexist){
            return res.status(500).send("user is exists")
        }
    
        const hashedpassword = await createHash(password);   
        const user = new User({
            username,
            email,
            phone,
            password:hashedpassword,
            role
        })
        await user.save()
        
        res.status(200).json({user,message:'signin successfull'})
        
    }
    catch(err){
        console.log("error ::" ,err)
        res.status(500).send('not created')
    }
    }
export const login = async(req,res,next)=>{
    try{
        const {email , password } = req.body
        const user = await User.findOne({email:email})
        if(!user){
            return res.send('no user exists')
        }
        const checkpassword = await bcrypt.compare(password, user.password)
        if(!checkpassword){
            return res.send('password not match')
        }
        const role = user.role
        const token = await generateToken(user.email,user.role)
        console.log(token)
        res.cookie('token',token);
        res.status(200).json({user,role,token,message:'login successfull'})

    }
    catch(err){
        console.log('the error', err)
        res.status(500).send('cant login')
    }
};
export  const updatePassword = async(req,res,next)=>{
  try{
    const {userid , password , confirm , current} = req.body
    const user = await User.findById(userid)
    const checkpassword = await bcrypt.compare(current , user.password)
    
    if(checkpassword){
        if(password !== confirm){
            return res.send("the passwords arent matching")
        }
        const newPassword = await createHash(password)
        const updateduser = await User.findByIdAndUpdate({_id : userid},{password:newPassword},{new:true})
        return res.send("password changed successfully")
    }
    res.send("the password that you entered wrong")
   
  }
  catch(err){
   console.log("password >>",err)
  }
};
export const updateProfile = async(req,res,next)=>{
    try{
            const {userid , email , phone , username} = req.body
            const updateduser = await User.findByIdAndUpdate({_id : userid},{email:email, phone:phone , username:username},{new:true})
            res.status(200).json({updateduser,message:"successfull"})
    }
    catch(err){
            console.log('error::',err)
    }
}
export const deleteUser = async(req,res,next)=>{
    try{
        
            const deleted =  await User.findByIdAndDelete(req.params.userid)
             res.status(200).json({deleted,message:'deleted'})
  
    }
    catch(err){
        console.log("error::",err)
    }
  };
  export const getallUser = async(req,res,next)=>{
    try{
           const turfs = await User.find()
           res.status(200).json(turfs)
    }
    catch(err){
      console.log("erro:",err)
    }
  };
