import mongoose from "mongoose";
import Court from "../models/court.js";
import Turf from "../models/turf.js";
import User from "../models/user.js";

export const addcourt =  async(req,res,next)=>{
    try{
          const{turfid} = req.params
          const court = new Court({
            ...req.body,
            turf : turfid
          })
          await court.save()
          await Turf.findByIdAndUpdate(turfid,{$push:{court:court._id}},{new:true})
          res.status(200).json(court)

    }
    catch(err){    
      
      console.log('error',err)
    }
};
export const getCourts = async(req,res,next)=>{
  try{
        const{turfid} = req.params
        const turf = await  Turf.findById(turfid).populate('court').exec();
        res.json({turf,message:'fetched'})
  }
  catch(err){
    console.log("error:",err)
  }
};
export const updateCourt= async(req,res,next)=>{
  try{
          
          const {courtid , price}  =  req.body
           const newcourt = await Court.findByIdAndUpdate(courtid,{price : price},{new:true})
           res.status(200).json(newcourt)
        
          
    }
    catch(err){
      console.log("error",err)
    }
  };
  export const deleteCourt = async(req,res,next)=>{
      try{
            const deleted =  await Court.findByIdAndDelete(req.params.courtid)
            res.status(200).json({deleted,message:'deleted'})
            await Turf.updateOne(
              { _id: deleted.turf },
              { $pull: { court: deleted._id.toString() } } 
            )
      }
      catch(err){

      }
  };
  export const getOneCourt = async(re,res,next)=>{
     try{
               const {courtid} = req.params
     }
     catch(err){
      console.log(err)
     }

  }
 