import mongoose  from "mongoose";

const bookingSchema = new mongoose.Schema({
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },  
    payment: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Payment' 
      
    },
    date:{
          type:Date,
    },
    timeslot: {
      start: {
        type: Number,
        required: true
      },
      end: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ['confirmed', 'pending', 'canceled'],
        default: 'pending',
        required:true
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    price :{
      type:Number,
      required : true
    },
    status : {
      type: String,
      enum: ['confirmed', 'pending', 'canceled'],
      default: 'pending',
      required:true
    }

  });
  const Booking = mongoose.model('Booking',bookingSchema)
  export default Booking;