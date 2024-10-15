import Booking from "../models/booking.js"
import Court from "../models/court.js"
import User from "../models/user.js"
import Turf from "../models/turf.js";


export const createBooking = async(req,res,next)=>{
    try{
            const{userid} =req.params
            const{courtid} = req.params
            const {start} =req.body.timeslot
            const {end}  = req.body.timeslot
            const bookdate = new Date(req.body.date)
            // Find the court to create a booking
            const court = await Court.findById(courtid)
            // check allready booking existed in the given timeslot
            const bookingsExist = await Booking.findOne({court : courtid , 
                'timeslot.start':start ,
                 'timeslot.end':end ,
                  date : bookdate}) 
            if(bookingsExist && bookingsExist.status !== 'canceled'){
                return res.send('this time slot isnt available')
            }
            if(bookingsExist.status === 'canceled'){
              bookingsExist.user = userid;
              bookingsExist.status = 'pending';
              bookingsExist.payment = '';
              await bookingsExist.save();
              await User.findByIdAndUpdate(userid, { $push: { bookings: bookingsExist._id } }, { new: true });
              return res.status(200).send('Booking Successful!');
            }           

            // create new booking

            const booking = new Booking({
                ...req.body,
                user : userid,
                court : courtid,
                price : court.price            })
            await booking.save()

            // Updating the User's document by pushing the booking ID into the 'bookings' array

            await User.findByIdAndUpdate(userid,{$push:{bookings:booking._id}},{new:true})
            res.status(200).send('Booking Successfull!')
    }
    catch(err){
        console.log("error::",err)
    }
};
export const cancelBooking = async(req,res,next)=>{
    try{    

            const deleted = await Booking.findByIdAndUpdate(req.params.bid,{status : "canceled"},{new : true})
            if(!deleted){
                return res.status(500).send("there is no such booking")
            }
            res.status(200).json({message : 'BOOKING CANCELLED' , deleted})
    }
    catch(err){
         console.log(err)
    }
};
export const getallbookig = async(req,res,next)=>{
    try{
             const bookings = await Booking.find().populate({path:'court',populate:{path : 'turf'}}).exec()
             if(!bookings){
                
                    return res.status(500).send("there is no booking")
                

             }
             res.status(200).json(bookings)

    }
    catch(err){
        console.log(err)
    }
};
export const getManagerBooking = async(req,res,next)=>{
    try{
                const managerid = req.params.managerid
                const turf = await Turf.findOne({manager:managerid})
                const courtids = turf.court && turf.court.map(court=>court._id.toString())
                const bookings = await Booking.find({court :{
                    $in : courtids
                }
                }).populate('court').populate('user')
                res.status(200).json(bookings)
                

                
    }
    catch(err){
        console.log(err)
    }
};
export const updateBooking = async (req, res, next) => {
    try {
      const { courtid, bid } = req.params;
      const { start, end } = req.body.timeslot;
      const{date} = req.body;
  
      const bookdate = new Date(date);
    
      const booking = await Booking.findById(bid);
      console.log("booking", booking)
      if (!booking) {
        return res.status(404).send('Booking not found');
      }
  
      // Check if the booking is already canceled
      if (booking.status === 'canceled') {
        return res.status(400).send('The booking is already canceled');
      }
  
      // Check if a booking already exists for the same court, timeslot, and date
      const bookingsExist = await Booking.find({
        court: courtid,
        'timeslot.start': start,
        'timeslot.end': end,
        date: bookdate,
        _id: { $ne: bid } // Exclude the current booking from the check
      });
      console.log("bookingexist", bookingsExist)
      if (bookingsExist.length > 0) {
        return res.status(409).send('This timeslot is not available');
      }
  
      // Update the booking timeslot
      const updatedBooking = await Booking.findByIdAndUpdate(
        bid,
        {
          "timeslot.start": start,
          "timeslot.end": end,
          date: bookdate
        },
        { new: true }
      );
      if (!updatedBooking) {
        return res.status(500).send('Booking update failed');
      }
  
      // Return the updated booking
      res.status(200).json({ message: 'Booking updated successfully', updatedBooking });
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while updating the booking');
    }
  };
  
