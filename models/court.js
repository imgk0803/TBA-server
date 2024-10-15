import mongoose from "mongoose";

const courtSchema = new mongoose.Schema({
    turf : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Turf',
        required :true
    },
  sport : {
         type : String,
         enum :['Football','Cricket','Badminton','Volleyball'],
         required : true
        
  },
  description : {
        type : String,
        required : true
  },
  size:{
    type : String,
    required : true
  },
price : {
    type :Number,
    required : true
}
 



})
const Court = mongoose.model('Court',courtSchema)
export default Court; 