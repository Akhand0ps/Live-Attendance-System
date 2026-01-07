import express from "express"
import { authenticate } from "../middleware/auth.middleware.js";
import { verifyRole } from "../middleware/auth.role.js";
import { classPost } from "../controller/class.controller.js";


const router = express.Router();



router.post("/class",authenticate,verifyRole,classPost);



export default router;