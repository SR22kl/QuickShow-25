import express from "express";
import {
  getAllBookings,
  getAllShows,
  getDashboardData,
  isAdmin,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/auth.js";

const adminRouter = express.Router();

//chek user is admin or not - /api/admin/is-admin
adminRouter.get("/is-admin", protectAdmin, isAdmin);

//Get dashboard data:- /api/admin/dashboard
adminRouter.get("/dashboard", protectAdmin, getDashboardData);

//Get all shows:- /api/admin/all-shows
adminRouter.get("/all-shows", protectAdmin, getAllShows);

//Get all bookings:- /api/admin/all-bookings
adminRouter.get("/all-bookings", protectAdmin, getAllBookings);

export default adminRouter;
