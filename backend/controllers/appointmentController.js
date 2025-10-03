import express from "express";
import Appointment from "../models/appointmentSchema.js";
import { isUserAuthenticated } from "../middlewares/auth.js";

export const createAppointment = async (req, res) => {
  try {
    const { service, date, time, address, notes, fee } = req.body;
    if (!service || !date || !time || !address) {
      return res.status(400).json({ success: false, message: "All fields except notes are required" });
    }
    const appointment = await Appointment.create({
      user: req.user._id,
      service,
      date,
      time,
      address,
      notes,
      fee,
    });
    res.status(201).json({ success: true, appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).populate("serviceProvider", "firstName lastName email");
    res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
