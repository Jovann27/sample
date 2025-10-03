import express from "express";
import { createAppointment, getMyAppointments } from "../controllers/appointmentController.js";
import { isUserAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", isUserAuthenticated, createAppointment);
router.get("/my", isUserAuthenticated, getMyAppointments);

export default router;
