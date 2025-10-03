import express from "express";
import { totalsReport, demographicsReport, skillsReport } from "../controllers/reportsController.js";
import { getJobFair, getSkilledUsers } from "../controllers/settingsController.js";

const router = express.Router();
router.get("/totals", totalsReport);
router.get("/demographics", demographicsReport);
router.get("/skills", skillsReport);
router.get("/jobfair", getJobFair);
router.get("/skilled-users", getSkilledUsers);  


export default router;
