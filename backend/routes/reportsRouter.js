import express from "express";
import { totalsReport, demographicsReport, skillsReport } from "../controllers/reportsController.js";

const router = express.Router();
router.get("/totals", totalsReport);
router.get("/demographics", demographicsReport);
router.get("/skills", skillsReport);

export default router;
