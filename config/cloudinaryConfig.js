import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()
cloudinary.v2.config({ 
    cloud_name: process.env.CLOUDINARY, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });
  
  const cloudinaryInstance= cloudinary.v2
  export default cloudinaryInstance;