import mongoose from "mongoose";
import Booking from "../models/booking.js";
import crypto from 'crypto'
import { razorpayInstance } from "../config/razorPayconfig.js";
import Payment from "../models/payment.js";

const key = razorpayInstance.key_secret
export const createOrder = async(req,res,next)=>{
      try{
           const {total}= req.body 
           const options ={
                  amount: total*100, 
                  currency: "INR",
                  receipt: "order_rcptid_11"
                };
                const order = await razorpayInstance.orders.create(options)
                if(!order){
                  return res.send("order is not created")
                }
                
                res.status(200).json(order) 
      }
      catch(err){
            console.log(err)
      }
};

export const verifyPayment = async(req,res,next)=>{
      try{    
              const {pay_id,order_id,signature,bookingsid,user} = req.body
              const hmac = crypto.createHmac('sha256',key);
              hmac.update(order_id + '|' + pay_id);
             const generated_signature = hmac.digest('hex');

             if (generated_signature === signature) {
                const razorpayPayment = await razorpayInstance.payments.fetch(pay_id);
                if(razorpayPayment.status === "captured"){
                  const payment = new Payment({
                        user : user,
                        booking : bookingsid,
                        order : order_id,
                        amount: razorpayPayment.amount/100 ,
      
                      })
                      await payment.save()
                  
                    
                      const objectIds = bookingsid.map(id => new mongoose.Types.ObjectId(id));
                      
                      // Update bookings with the payment ID
                      const result = await Booking.updateMany(
                        { _id: { $in: objectIds } },
                        { $set: { payment: payment._id } }
                      );
                
                  payment.p_status = 'paid';
                  payment.created = new Date();
                  await payment.save()
                  const bookings = await Booking.find({payment : payment._id }).exec()
                  for(const booking of bookings){
                    booking.status = "confirmed"
                    await booking.save()
                   
                    
                    
                   }
                   return res.send('Payment is successful');

                }
                else{
                  const objectIds = bookingsid.map(id => new mongoose.Types.ObjectId(id));

                  await Booking.deleteMany({ _id: { $in: objectIds } });
      
                  return res.status(400).json({ 
                      error: 'Payment failed. Associated bookings have been deleted.' 
                  });
                }
             
      }
      
      res.send("invalid signature")
      

}
      catch(err){
            console.log(err)
      }
};
export const getpayment = async(req,res,next)=>{
      try{
              const payment =  await Payment.find({user : user})
              res.status(200).json(payment)

      }
      catch(err){
            console.log("error:",err)
      }
}
export const getallpayment = async(req,res,next)=>{
      try{
              const payment =  await Payment.find().populate({path : 'booking', populate:{path :'court',
                  populate : {path:'turf'}
              }}).exec()
              res.status(200).json(payment)

      }
      catch(err){
            console.log("error:",err)
      }
}