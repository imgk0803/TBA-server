import dotenv from 'dotenv';
dotenv.config();

const razorpayKey = (req, res) => {
  const key_razorpay = process.env.RAZORPAY_FRONTEND_KEY;
  
  if (!key_razorpay ) {
    return res.status(500).json({ message: 'Razorpay key not found' });
  }
  res.status(200).json(key_razorpay);
};

export default razorpayKey;
