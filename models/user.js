import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        username :{
         type : String,
         required : true,
         minLength :3
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 30,
          },
          
            phone :{
                type :Number,
                minLength : 10
            },
          password: {
            type: String,
            required: true,
            minLength: 6,
          },
          role :{
            type : String,
            enum : ['user','manager','admin'],
            default : 'user'
            
          },
          bookings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
          }] ,   
        
    
    }

);
const User = mongoose.model('User', userSchema);
export default User