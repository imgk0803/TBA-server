import express from 'express'
import {cancelBooking, getallbookig, getManagerBooking, updateBooking } from '../controller/bookingController.js'
import { managerturf } from '../controller/turfController.js'
const managerRouter = express.Router()
managerRouter.get('/getmanagerbookings/:managerid',getManagerBooking)//ok
managerRouter.get('/booking',getallbookig)
managerRouter.patch('/court/:courtid/booking/:bid',updateBooking)//oko
managerRouter.patch('/cancelbooking/:bid',cancelBooking)//ok
managerRouter.get('/getturfby/:managerid',managerturf)


export default managerRouter