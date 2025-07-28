import express from "express";
import {
  getFavorites,
  getUserBookings,
  updateFavorite,
} from "../controllers/userController.js";
import { protectAdmin } from "../middleware/auth.js";

const userRouter = express.Router();

//Get user bookings- /api/user/bookings
userRouter.get("/bookings", getUserBookings);

//Get user favorites- /api/user/favorites
userRouter.get("/favorites", getFavorites);

//Update user favorites- /api/user/update-favorite
userRouter.post("/update-favorite", updateFavorite);

export default userRouter;
