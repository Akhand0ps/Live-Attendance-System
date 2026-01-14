import express from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { verifyRole ,OnlyUser} from '../middleware/auth.role.js'
import {
  addStudent,
  createClass,
  getclassdetails,
} from '../controller/class.controller.js'

const router = express.Router()

router.post('/create-class', authenticate, verifyRole, createClass)
router.post('/:id/add-student', authenticate, verifyRole, addStudent)
router.get('/:id', authenticate, getclassdetails)



export default router
