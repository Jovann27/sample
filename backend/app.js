import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRouter.js";
import adminAuthRouter from "./routes/adminAuthRouter.js";
import adminRouter from "./routes/adminRouter.js";
import contactRoutes from "./routes/contact.js";
import reportRoutes from "./routes/reportsRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import settingsRouter from "./routes/settingsRouter.js";
import { errorMiddleware } from "./middlewares/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Resolve frontend origin from env with a safe development default
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
console.log("Using FRONTEND_URL for CORS:", FRONTEND_URL);
console.log("Registering CORS middleware...");
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
console.log("CORS middleware registered");

// Ensure preflight requests are handled for all routes
// Note: explicit app.options registration removed because it caused path-to-regexp errors
// CORS global middleware above will handle preflight requests automatically.

console.log("Registering cookie parser...");
app.use(cookieParser());
console.log("Cookie parser registered");
console.log("Registering express.json...");
app.use(express.json());
console.log("express.json registered");
console.log("Registering express.urlencoded...");
app.use(express.urlencoded({ extended: true }));
console.log("express.urlencoded registered");

// express-fileupload: use temp files so controllers can access tempFilePath
console.log("Registering fileUpload...");
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
console.log("fileUpload registered");

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin/auth", adminAuthRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/settings", settingsRouter);
app.use("/api/v1/reports", reportRoutes);

// health
app.get("/api/v1/ping", (req, res) => res.json({ success: true, message: "pong" }));

// error handler (must be after routes)
app.use(errorMiddleware);

export default app;
