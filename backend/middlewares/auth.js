import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import Admin from "../models/adminSchema.js";

export const isUserAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return res.status(401).json({ success: false, message: "Please login first (user)" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.type !== "user") return res.status(401).json({ success: false, message: "Not a user token" });

    const user = await User.findById(decoded.id).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("User auth error:", error.message);
    return res.status(401).json({ success: false, message: "Authentication failed (user)" });
  }
};

export const isAdminAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return res.status(401).json({ success: false, message: "Please login first (admin)" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.type !== "admin") return res.status(401).json({ success: false, message: "Not an admin token" });

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ success: false, message: "Admin not found" });

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);
    return res.status(401).json({ success: false, message: "Authentication failed (admin)" });
  }
};
