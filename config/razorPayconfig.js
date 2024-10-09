import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config()
const id = process.env.RAZ_KEY
const key = process.env.RAZ_SECRET;
export const razorpayInstance = new Razorpay({
  key_id: id,
  key_secret: key
});
