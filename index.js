import express from 'express'
import cors from 'cors'
import dbConnect from './config/db.js'
import v1Router from './route/v1router.js'
import cookieParser from 'cookie-parser'

const app = express()
const port = 3000
dbConnect();
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use('/api', v1Router)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})