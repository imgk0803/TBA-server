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
            if(!userid){
              return res.status(200).json({success:false , message : 'Please Login First!'})
            }
            const bookdate = new Date(req.body.date)
            // Find the court to create a booking
            const court = await Court.findById(courtid)
            // check allready booking existed in the given timeslot
            const bookingsExist = await Booking.findOne({court : courtid , 
                'timeslot.start':start ,
                 'timeslot.end':end ,
                  date : bookdate}) 
            if(!bookingsExist){
              
            // create new booking

            const booking = new Booking({
              ...req.body,
              user : userid,
              court : courtid,
              price : court.price            })
              await booking.save()

                // Updating the User's document by pushing the booking ID into the 'bookings' array
               return res.status(200).json({success : true , booking ,  message : 'Booking Successful!'});
            }
            if(bookingsExist && bookingsExist.status !== 'canceled'){
                return res.status(200).json({success : false , message : 'this time slot isnt available'})
            }
            // if the booking existed as cancelled then modify it as the new booking details

            if(bookingsExist.status === 'canceled'){
              bookingsExist.user = userid;
              bookingsExist.status = 'pending';
              await bookingsExist.save();
              await User.findByIdAndUpdate(userid, { $push: { bookings: bookingsExist._id } }, { new: true });
              return res.status(200).json({success : true , booking : bookingsExist, message : 'Booking Successful!'});
            }           

    }
    catch(err){
      console.log("error ==",err)
      res.status(400).json({success : false , message : err.message})
    }
};
export const cancelBooking = async(req,res,next)=>{
    try{    
            console.log(req.params)
            const deleted = await Booking.findByIdAndUpdate(req.params.bid,{status : "canceled"},{new : true})
            if(!deleted){
                return res.status(500).send("there is no such booking")
            }
            res.status(200).json({message : 'BOOKING CANCELLED' , deleted})
    }
    catch(err){
      console.log("error ==",err.message)
      res.status(400).json({success : false , message : err.message})
    }
};
export const getallbookig = async(req,res,next)=>{
    try{
             const bookings = await Booking.find().populate({path:'court',populate:{path : 'turf'}}).exec()
             if(!bookings){
                
                    return res.status(400).json({ success : false , message : "there is no booking"})
                

             }
             res.status(200).json({success : true , message : 'bookings fetched' , bookings})

    }
    catch(err){
      console.log("error ==",err.message)
      res.status(400).json({success : false , message : err.message})
    }
};
export const getManagerBooking = async (req, res, next) => {
  try {
    const managerid = req.params.managerid;
    const allturf = await Turf.find({ manager: managerid });
    const activeTurfs = allturf.filter(turf => turf.isActive === true);
    const courtids = activeTurfs.flatMap(turf => turf.court.map(court => court._id.toString()));
    const bookings = await Booking.find({
      court: {
        $in: courtids
      }
    }).populate('court').populate('user');
    res.status(200).json({ bookings, activeTurfs });
  } catch (err) {
    console.log("error ==", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateBooking = async (req, res, next) => {
  try {
      const { courtid, bid } = req.params;
      const { start, end, date } = req.body;

      const bookdate = new Date(date);

      const booking = await Booking.findById(bid);
      if (!booking) {
          return res.status(200).json({ success: false, message: 'Booking not found' });
      }

      if (booking.status === 'canceled') {
          return res.status(200).json({ success: false, message: 'The booking is already canceled' });
      }

      const bookingsExist = await Booking.find({
          court: courtid,
          'timeslot.start': start,
          'timeslot.end': end,
          date: bookdate,
          _id: { $ne: bid }
      });

      if (bookingsExist.length > 0) {
          const conflictingBooking = bookingsExist.find(b => b.status !== 'canceled');
          if (conflictingBooking) {
              return res.status(200).json({ success: false, message: 'A booking already exists for this timeslot' });
          }
      }

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
          return res.status(500).json({ success: false, message: 'Booking update failed' });
      }

      res.status(200).json({ success: true, message: 'Booking updated successfully', updatedBooking });
  } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while updating the booking');
  }
};

  export const deleteBooking = async(req,res,next)=>{
    try{    
            console.log(req.params)
            const deleted = await Booking.findByIdAndDelete(req.params.bid)
            if(!deleted){
                return res.status(500).send("there is no such booking")
            }
            res.status(200).json({message : 'BOOKING deleted' , deleted})
    }
    catch(err){
      console.log("error ==",err.message)
      res.status(400).json({success : false , message : err.message})
    }
};
  
