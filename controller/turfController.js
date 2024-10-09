import Court from "../models/court.js";
import Turf from "../models/turf.js";
import User from "../models/user.js";
import cloudinaryInstance from "../config/cloudinaryConfig.js";



export const createTurf = async(req,res,next)=>{
     try{
         if(!req.file){
            return res.send('the file is not visible')
          }
          const result = await cloudinaryInstance.uploader.upload(req.file.path)
          const imageUrl = result.secure_url
          const {manager,title,description,city,dist,lat,long} = req.body
          const managerexist = await User.findOne({email : manager})
          if(managerexist.role !== 'manager'){
            return res.send('add manager first')
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
          res.status(200).json({turf,message:'turf created'})
     }
     catch(err){
        console.log("error ==",err)
        res.status(500).send("couldnt create")
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
        res.status(200).json({newturf,message:'turf updated'})
    }
    catch(err){
        console.log('error:',err)

    }
};
export const deleteTurf = async(req,res,next)=>{
  try{
          const deleted =  await Turf.findByIdAndDelete(req.params.turfid)
           res.status(200).json({deleted,message:'deleted'})

  }
  catch(err){
      console.log("error::",err)
  }
};
export const getallTurf = async(req,res,next)=>{
  try{
         const turfs = await Turf.find().populate('court').exec();
         res.status(200).json(turfs)
  }
  catch(err){
    console.log("erro:",err)
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
    res.status(200).json(turf)
        
  }
  catch(err){
    console.log("error:", err)
  }
};
export const managerturf =async(req,res,next)=>{
   try{
           const managerid = req.params.managerid
           const turf = await Turf.findOne({manager:managerid})
           res.status(200).json(turf)
   }
   catch(err){
            console.log(err)
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
         res.status(200).json(turfs)
  }
  catch(error){
          console.log(error)
  }
}


