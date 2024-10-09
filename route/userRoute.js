import express from "express";
import {deleteUser, getallUser, login, signin, updatePassword, updateProfile} from '../controller/userController.js'
import {createBooking, deleteBooking, getallbookig } from "../controller/bookingController.js";
import { createOrder, getallpayment, verifyPayment } from "../controller/paymentController.js";
import { mock } from "../utils/mocksignature.js";
import { getallTurf, getTurf, sortTurfs } from "../controller/turfController.js";
import { createReview, deleteReview, getReview, updateReview } from "../controller/reviewController.js";
import { getCourts } from "../controller/courtController.js";
import razorpayKey from "../utils/frontEndKey.js";
const userRouter = express.Router()
userRouter.post('/signin',signin)//ok
userRouter.post('/login',login)//ok
userRouter.post('/:userid/court/:courtid',createBooking)
userRouter.delete('/deletebooking/:bid',deleteBooking)//ok
userRouter.post('/createorder',createOrder)
userRouter.post('/verifypayment',verifyPayment)
userRouter.get('/mock',mock)
userRouter.get('/bookings',getallbookig)
userRouter.get('/payments',getallpayment)
userRouter.post('/turf/addreview',createReview)
userRouter.get('/getreview',getReview)
userRouter.patch('/editreview/:id',updateReview)
userRouter.delete('/deletereview/:id',deleteReview)
userRouter.get('/turf',getallTurf)
userRouter.get('/getoneturf/:turfid',getTurf)
userRouter.patch('/updatepwd',updatePassword)
userRouter.patch('/updateprofile',updateProfile)
userRouter.delete('/deleteuser/:userid',deleteUser)
userRouter.get('/getusers',getallUser)
userRouter.get('/turf/getcourt/:turfid',getCourts)
userRouter.get('/turfs',sortTurfs)//ok
userRouter.get('/razorpaykey',razorpayKey)


export default userRouter