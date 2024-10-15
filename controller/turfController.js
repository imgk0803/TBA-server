import Court from "../models/court.js";
import Turf from "../models/turf.js";
import User from "../models/user.js";
import cloudinaryInstance from "../config/cloudinaryConfig.js";



export const createTurf = async(req,res,next)=>{
     try{
         if(!req.file){
            return res.status(400).json({success : false , message : 'the file is not visible'})
          }
          const result = await cloudinaryInstance.uploader.upload(req.file.path)
          const imageUrl = result.secure_url
          const {manager,title,description,city,dist,lat,long} = req.body
          const managerexist = await User.findOne({email : manager})
          if(managerexist.role !== 'manager'){
            return res.status(400).json({success : false , message : 'add manager first'})
          }
          if(!lat && !long){
            return res.status(400).json({success : false , message : 'coordinates should be given..'})
          }
          const {id} = managerexist
          const turf = new Turf({
            manager:id,
            title,
            description,
            city,
            dist,
            location: {
              type: "Point",
              coordinates: [parseFloat(long), parseFloat(lat)],
          },
            image:imageUrl
          })
          await turf.save()
          res.status(200).json({success : true ,turf,message:'turf created'})
     }
     catch(err){
        console.log("error ==",err.message)
        res.status(400).json({success : false , message : err.message})
     }
};
export const updateTurf = async(req,res,next)=>{
    try{
      if(req.file){
        const result = await cloudinaryInstance.uploader.upload(req.file.path)
        const imageUrl = result.secure_url
        req.body.image = imageUrl
      }
       
        const newturf = await Turf.findByIdAndUpdate(req.params.turfid,req.body,{new:true})
        res.status(200).json({success : true , newturf,message:'turf updated'})
    }
    catch(err){
      console.log("error ==",err.message)
      res.status(400).json({success : false , message : err.message})
    }
};
export const deleteTurf = async(req,res,next)=>{
  try{
          const deleted =  await Turf.findByIdAndUpdate(req.params.turfid,{isActive : false},{new:true})
          if(!deleted){
            return res.status(400).json({success : false , message : 'Can\'t find any turfs'})
          }
          res.status(200).json({success:true ,deleted,message:'deleted'})

  }
  catch(err){
    console.log("error ==",err.message)
    res.status(400).json({success : false , message : err.message})
  }
};
export const getallTurf = async(req,res,next)=>{
  try{
         const turfs = await Turf.find().populate('court').exec();
         res.status(200).json({success : true , turfs , message : 'turfs fetched successfully'})
  }
  catch(err){
    console.log("error ==",err.message)
    res.status(400).json({success : false , message : err.message})
  }
};
export const getTurf = async(req,res,next)=>{
  try {
    const turf = await Turf.findById(req.params.turfid).populate('court').populate({path: 'reviews',
      populate: {
        path: 'reviewer', 
        select: 'username ', 
      },
    }).exec();
    res.status(200).json({success : true , turf , message : 'turf fetched succesfully..'})
        
  }
  catch(err){
    console.log("error ==",err.message)
    res.status(400).json({success : false , message : err.message})
  }
};
export const managerturf =async(req,res,next)=>{
   try{
           const managerid = req.params.managerid
           const turf = await Turf.findOne({manager:managerid})
           res.status(200).json({success: true , turf , message : "turf fetched successfully"})
   }
   catch(err){
    console.log("error ==",err.message)
    res.status(400).json({success : false , message : err.message})
   }


}
export const sortTurfs = async(req,res)=>{
  try{
         const lat = parseFloat(req.query.lat)
         const lon = parseFloat(req.query.lon)
         const turfs = await Turf.find({
          location : {
            $near : {
              $geometry :{
                type: 'Point',
                coordinates: [lon, lat]
              },
              $maxDistance: 100000 
            }
          }
         }).limit(10)
         res.status(200).json({success : true , turfs , message : 'turf sorted successfully'})
  }
  catch(error){
    console.log("error ==",err.message)
    res.status(400).json({success : false , message : err.message})
  }
}


