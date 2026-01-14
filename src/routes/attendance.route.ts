import express from "express"
import { attendanceStart, myattendance } from "../controller/attendance.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { OnlyUser ,verifyRole } from "../middleware/auth.role";

const router = express.Router();


router.get('/:id/my-attendance',authenticate,OnlyUser,myattendance)
router.post("/start",authenticate,verifyRole,attendanceStart)



export default router;