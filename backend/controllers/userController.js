import User from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import sendToken from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

const uploadToCloudinary = async (filePath, folder) => {
  const res = await cloudinary.v2.uploader.upload(filePath, { folder });
  return res.secure_url;
};

export const register = catchAsyncError(async (req, res, next) => {
  const { username, firstName, lastName, email, phone, address, birthdate, employed, password, confirmPassword, role } = req.body;

  if (!username || !firstName || !lastName || !email || !phone || !address || !birthdate || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please fill up all required fields", 400));
  }

  if (password !== confirmPassword) return next(new ErrorHandler("Passwords do not match", 400));

  const [isUsername, isPhone, isEmail] = await Promise.all([
    User.findOne({ username }),
    User.findOne({ phone }),
    User.findOne({ email }),
  ]);

  if (isUsername) return next(new ErrorHandler("Username already exists", 400));
  if (isPhone) return next(new ErrorHandler("Phone already exists", 400));
  if (isEmail) return next(new ErrorHandler("Email already exists", 400));

  const validIdFile = req.files?.validId;
  if (!validIdFile) return next(new ErrorHandler("Valid ID is required", 400));

  const uploadedFiles = {};
  uploadedFiles.validId = await uploadToCloudinary(validIdFile.tempFilePath, "skillconnect/validIds");

  if (req.files?.profilePic) uploadedFiles.profilePic = await uploadToCloudinary(req.files.profilePic.tempFilePath, "skillconnect/profiles");

  const certificatePaths = [];
  if (req.files?.certificates) {
    const filesArray = Array.isArray(req.files.certificates) ? req.files.certificates : [req.files.certificates];
    for (const file of filesArray) certificatePaths.push(await uploadToCloudinary(file.tempFilePath, "skillconnect/certificates"));
  }

  const user = await User.create({
    username, firstName, lastName, email, phone, address, birthdate, employed,
    password, role,
    validId: uploadedFiles.validId,
    profilePic: uploadedFiles.profilePic || "",
    certificates: certificatePaths,
  });

  sendToken(user, 201, res, "User registered successfully");
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ErrorHandler("Please fill up all fields", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid email or password!", 400));

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) return next(new ErrorHandler("Invalid email or password!", 400));

  sendToken(user, 200, res, `${user.role} logged in successfully`);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
});
