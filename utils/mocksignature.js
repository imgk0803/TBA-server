import crypto from "crypto"
import { razorpayInstance } from "../config/razorPayconfig.js";
const key = razorpayInstance.key_secret
//This is test function to check the razorpay integration working!
export const mock=()=>{


const order_id = 'order_Og037ioJ5yIgZ0'; // Replace with  order_id
const pay_id = 'pay_H9o5O8Zf3UxY45'; // Replace with  pay_id
const key_secret = key ; // Replace with  key secret

const hmac = crypto.createHmac('sha256', key_secret);
hmac.update(order_id + '|' + pay_id);
const generated_signature = hmac.digest('hex');
}