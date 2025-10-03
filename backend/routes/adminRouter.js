import express from "express";
import {
  createJobFair,
  adminGetAllServiceRequests,
  verifyUser,
  getAllUsers,
  getServiceProviders,
} from "../controllers/adminController.js";

import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/jobfairs", isAdminAuthenticated, createJobFair);
router.get("/service-requests", isAdminAuthenticated, adminGetAllServiceRequests);
router.put("/verify-user/:id", isAdminAuthenticated, verifyUser);
router.get("/users", isAdminAuthenticated, getAllUsers);
router.get("/service-providers", isAdminAuthenticated, getServiceProviders);

export default router;
