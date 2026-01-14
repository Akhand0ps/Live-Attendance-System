import express from 'express'

const app = express()

import UserR from './routes/user.route'
import ClassR from './routes/class.route'
import AttR from './routes/attendance.route'
app.use(express.json())

app.use('/api/v1/auth', UserR)
app.use('/api/v1/class', ClassR)
app.use('/api/v1/attendance',AttR);

export default app
