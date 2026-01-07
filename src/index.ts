import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'
import { connectDb } from './config/db.config'

const uri = process.env.uri
const PORT = process.env.PORT

connectDb(uri!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on PORT ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('err came while connecting to db and starting server')
  })
