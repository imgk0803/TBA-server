import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required :true
    },
    booking :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Booking',
        required : true
    }],
    order :{
        type:String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    p_status : {
        type:String,
        enum:['paid','pending','failed'],
        default : 'pending'
        
    },
    created : {
        type:Date,
    }

})
const Payment = mongoose.model('Payment',paymentSchema)
export default Payment