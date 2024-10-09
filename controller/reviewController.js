import Review from "../models/review.js";
import Turf from "../models/turf.js";
import User from "../models/user.js";


export const createReview = async(req,res,next)=>{
    try{
                const{rating , turfreview , turfid , userid} = req.body
                const review = new Review({
                    rating : rating,
                    content : turfreview,
                    turf : turfid,
                    reviewer : userid,
                })
                await review.save()
                const turf = await Turf.findByIdAndUpdate(turfid,{$push : {reviews : review._id}},{new:true}).populate('reviews')
                res.status(200).json({review,turf})
    }
    catch(err){
        console.log(err)
    }
};

export const getReview = async(req,res,next)=>{
    try{

        const review = await Review.find()     
        if(!review){
           
               return res.status(500).send("there is no review")
           

        }
        res.status(200).json(review)

        

    }
    catch(err){
        console.log(err)
    }
};

export const updateReview = async(req,res,next)=>{
    try{
              const updated = await Review.findByIdAndUpdate(req.params.id,req.body,{new:true})
              res.status(200).json(updated)
    }
    catch(err){
        console.log(err)
    }
};
export const deleteReview = async(req,res,next)=>{
    try{
             const deleted = await Review.findByIdAndDelete(req.params.id)
             res.status(200).json(deleted)

    }
    catch(err){
        console.log(err)
    }
}