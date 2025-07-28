import stripe from "stripe";
import Booking from "../models/bookingModel.js";
import Show from "../models/showModel.js";
import { inngest } from "../inngest/index.js";

//Function to check availablility of selected seats for a movie
const checkSeatsAvailbility = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) {
      console.log(`Show with ID ${showId} not found.`);
      return false;
    }

    const occupiedSeats = showData.occupiedSeats;
    console.log("occupiedSeats:", occupiedSeats);
    console.log("Type of occupiedSeats:", typeof occupiedSeats);

    // ADD THESE DEBUGGING LINES FOR selectedSeats
    console.log("selectedSeats:", selectedSeats);
    console.log("Type of selectedSeats:", typeof selectedSeats);
    console.log("Is selectedSeats an array?", Array.isArray(selectedSeats));

    // This is the line causing the error
    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);
    return !isAnySeatTaken;
  } catch (error) {
    console.log("Error in checkSeatsAvailbility:", error.message);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    //Check availbility of selected seats for a movie
    const isAvailable = await checkSeatsAvailbility(showId, selectedSeats);

    if (!isAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "Selected seats are not available" });
    }

    //Get the show details
    const showData = await Show.findById(showId).populate("movie");
    if (!showData) {
      return res
        .status(400)
        .json({ success: false, message: "Show not found" });
    }

    //Create a new booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    selectedSeats.map((seat) => {
      showData.occupiedSeats[seat] = userId;
    });
    showData.markModified("occupiedSeats");
    await showData.save();

    //Stripe Gateway Initailize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Creating line items for Stripe
    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: showData.movie.title,
          },
          unit_amount: Math.floor(booking.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/mybookings`,
      cancel_url: `${origin}/mybookings`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        bookingId: booking._id.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes expiry
    });

    booking.paymentLink = session.url;
    await booking.save();

    // Run inngest funtion to check payment status after 10 min
    await inngest.send(
      "app/checkpayment",
      { bookingId: booking._id.toString() },
      { delay: 10 * 60 * 1000 }
    );

    res.status(200).json({
      success: true,
      message: "Booking Created Successfully!",
      booking,
      url: session.url,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);
    if (!showData) {
      return res
        .status(400)
        .json({ success: false, message: "Show not found" });
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.status(200).json({
      success: true,
      message: "Occupied Seats Fetched Successfully!",
      occupiedSeats,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
