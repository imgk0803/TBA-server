import Court from "../models/court.js";
import Turf from "../models/turf.js";

export const addcourt =  async(req,res,next)=>{
    try{
          const{turfid} = req.params
          const {sport , size , price , description } = req.body;
          if(!sport && !size && !price && !description){
            return res.status(200).json({success : false , message : "Please fill out the form"})
          }
          const court = new Court({
            ...req.body,
            turf : turfid
          })
          await court.save()
          await Turf.findByIdAndUpdate(turfid,{$push:{court:court._id}},{new:true})
          res.status(200).json({success : true , message : "court added successfully", court})

    }
    catch(err){    
      console.log("error ==",err.message)
      res.status(400).json({success : false , message : err.message})
    }
};
export const getCourts = async(req,res,next)=>{
  try{
        const{turfid} = req.params
        const turf = await  Turf.findById(turfid).populate('court').exec();
        if(!turf){
          return res.status(400).json({success : false , message : 'cant find any turf'})
        }
        res.json({success : true ,  turf ,message:'court fetched'})
  }
  catch(err){
    console.log("error:",err)
  }
};
export const updateCourt= async(req,res,next)=>{
  try{
          
          const {courtid , price}  =  req.body
           const newcourt = await Court.findByIdAndUpdate(courtid,{price : price},{new:true})
           res.status(200).json({success : true , message: 'court updated successfully '})
        
          
    }
    catch(err){
      console.log("error ==",err.message)
      res.status(400).json({success : false , message : err.message})    }
  };
  export const deleteCourt = async(req,res,next)=>{
      try{
            const {courtid} = req.params
            const deleted =  await Court.findByIdAndUpdate(courtid,{isActive : false},{new : true})
            res.status(200).json({success : true , message:'deleted'})
            await Turf.updateOne(
              { _id: deleted.turf },
              { $pull: { court: deleted._id.toString() } } 
            )
      }
      catch(err){
        console.log("error ==",err.message)
        res.status(400).json({success : false , message : err.message})
      }
  };
  
 