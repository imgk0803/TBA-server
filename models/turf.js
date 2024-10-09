import mongoose from "mongoose";

const turfSchema = new mongoose.Schema({
    manager: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
    court : [{type:mongoose.Schema.Types.ObjectId,ref:'Court'}],
    reviews : [{type:mongoose.Schema.Types.ObjectId,ref:'Review'}],
    title :{
        type : String,
        required : true
    },
   description :{
   type : String
   },
    city :{
        type : String,
        required :true

    },
    dist :{
        type : String,
        required:true
    },
    location : {
        type : {
            type : String,
            enum : ["Point"],
            default : "Point"
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    image :{
        type:String,
        require:true
    }

})
turfSchema.index({ location: '2dsphere' })
const Turf = mongoose.model('Turf', turfSchema)
export default Turf;