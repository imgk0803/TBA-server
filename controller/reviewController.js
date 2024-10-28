import Review from "../models/review.js";
import Turf from "../models/turf.js";


export const createReview = async(req,res,next)=>{
    try{
                const{rating , turfreview , turfid , userid} = req.body
                if(!rating && !turfreview ){
                    return res.status(400).json({success : false , message : "please provide rating and review"})
                }
                const review = new Review({
                    rating : rating,
                    content : turfreview,
                    turf : turfid,
                    reviewer : userid,
                })
                await review.save()
                const turf = await Turf.findByIdAndUpdate(turfid,{$push : {reviews : review._id}},{new:true})
                res.status(200).json({success : true , review , turf})
    }
    catch(err){
        console.log("error ==",err.message)
        res.status(400).json({success : false , message : err.message})
    }
};

export const getReview = async(req,res,next)=>{
    try{

        const review = await Review.find().populate('reviewer')     
        if(!review){
           
               return res.status(400).json({success : false , message : "there is no review"})
           

        }
        res.status(200).json({success : true , review , message : 'reviews fetched'})

        

    }
    catch(err){
        console.log("error ==",err.message)
        res.status(400).json({success : false , message : err.message})
    }
};

export const updateReview = async(req,res,next)=>{
    try{
              const updated = await Review.findByIdAndUpdate(req.params.id,req.body,{new:true})
              res.status(200).json({success : true , updated, message :"review updated"})
    }
    catch(err){
        console.log(err)
    }
};
export const deleteReview = async(req,res,next)=>{
    try{
             const deleted = await Review.findByIdAndUpdate(req.params.id,{isActive : false},{new:true})
             res.status(200).json({success : true , message : "deleted successfully" , deleted})

    }
    catch(err){
        console.log("error ==",err.message)
        res.status(400).json({success : false , message : err.message})
    }
}