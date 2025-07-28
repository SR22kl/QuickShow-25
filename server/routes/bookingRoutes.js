import express from "express";
import {
  createBooking,
  getOccupiedSeats,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

//Create a new booking- /api/booking/create
bookingRouter.post("/create", createBooking);

//get occupied seats - /api/booking/seats/:showId
bookingRouter.get("/seats/:showId", getOccupiedSeats);

export default bookingRouter;
