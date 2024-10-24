import User from "../models/user.js";
import createHash from "../utils/createHash.js";
import generateToken from "../utils/userToken.js";
import bcrypt from 'bcrypt'

export const signin= async (req,res,next) => {
try{
    
    const {username,email,password,phone,role} = req.body
    const userexist = await User.findOne({email : email}) 
    if(userexist){
        return res.status(200).json({success : false , message : "User already exists" })
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
    console.log(err.message);
    return res.status(400).json({ success: false, message: err.message });
}
}
export const createManager = async (req,res,next) => {
    try{
        
        const {username,email,password,phone,role} = req.body
        const userexist = await User.findOne({email : email}) 
        if(userexist){
            return res.status(200).json({success : false , message : "user is exists"})
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
        
        res.status(200).json({success : true ,user,message:'Manager Created successfully'})
        
    }
    catch(err){
        console.log("error ::" ,err.message)
        res.status(400).json({ success : false , message : err.message})
    }
    }
export const login = async(req,res,next)=>{
    try{
        const {email , password } = req.body
        if(!email && !password){
            return res.status(200).json({success : false , message : "please fill out the form.."})
        }
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(200).json({ success : false , message : 'User not exists..'})
        }
        const checkpassword = await bcrypt.compare(password, user.password)
        if(!checkpassword){
            return res.status(200).json({success:false , message : 'password not matching..'})
        }
        const role = user.role
        const token = await generateToken(user.email,user.role)
        console.log(token)
        res.cookie('token',token);
        res.status(200).json({success : true , user,role,token,message:'login successfull'})

    }
    catch(err){
        console.log('the error', err.message)
        res.status(400).json({succsess : false , message : err.message})
    }
};
export  const updatePassword = async(req,res,next)=>{
  try{
    const {userid , password , confirm , current} = req.body
    const user = await User.findById(userid)
    const checkpassword = await bcrypt.compare(current , user.password)
    
    if(checkpassword){
        if(password !== confirm){
            return res.status(200).json({success : false , message : "the passwords arent matching"})
        }
        const newPassword = await createHash(password)
        const updateduser = await User.findByIdAndUpdate({_id : userid},{password:newPassword},{new:true})
        return res.status(200).json({success : true , message : "password changed successfully"})
    }
    res.status(200).json({success : false , message :"the password that you entered wrong"})
   
  }
  catch(err){
    console.log('the error', err.message)
    res.status(400).json({succsess : false , message : err.message})
  }
};
export const updateProfile = async(req,res,next)=>{
    try{
            const {userid , email , phone , username} = req.body
            const updateduser = await User.findByIdAndUpdate({_id : userid},{email:email, phone:phone , username:username},{new:true})
            res.status(200).json({success : true , updateduser , message:"successfully updated profile"})
    }
    catch(err){
        console.log('the error', err.message)
        res.status(400).json({succsess : false , message : err.message})
    }
}
export const deleteUser = async(req,res,next)=>{
    try{
        
            const deleted =  await User.findByIdAndUpdate(req.params.userid,{isActive : false},{new : true})
             res.status(200).json({success : true , deleted,message:'deleted'})
  
    }
    catch(err){
        console.log('the error', err.message)
        res.status(400).json({succsess : false , message : err.message})
    }
  };
  export const getallUser = async(req,res,next)=>{
    try{
           const users = await User.find()
           res.status(200).json({success : true , users})
    }
    catch(err){
        console.log('the error', err.message)
        res.status(400).json({succsess : false , message : err.message})
    }
  };
