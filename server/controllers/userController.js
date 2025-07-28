import { clerkClient } from "@clerk/express";
import Booking from "../models/bookingModel.js";
import Movie from "../models/movieModel.js";

//Api controller funciton to get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;

    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: {
          path: "movie",
        },
      })
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, message: "User Bookings are fetched", bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (typeof movieId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid movieId provided." });
    }

    const userId = req.auth().userId;
    const user = await clerkClient.users.getUser(userId); // Get current user state

    let currentFavorites = user.privateMetadata.favorites || [];

    const isFavorited = currentFavorites.includes(movieId);
    let newFavorites;
    let message = "";

    if (!isFavorited) {
      newFavorites = [...currentFavorites, movieId]; // Add
      message = "Movie added to favorites successfully!";
    } else {
      newFavorites = currentFavorites.filter((item) => item !== movieId); // Remove
      message = "Movie removed from favorites successfully!";
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata, // Preserve other metadata fields
        favorites: newFavorites, // Pass the new array
      },
    });

    res.status(200).json({
      success: true,
      message: message,
    });
  } catch (error) {
    console.error("Error updating favorite:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//backend Api
export const getFavorites = async (req, res) => {
  try {
    const userId = req.auth().userId;

    // Introduce a small delay to allow Clerk's cache to update.
    await new Promise((resolve) => setTimeout(resolve, 100)); 

    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favorites || [];

    const movieIds = favorites.map((item) => {
      if (typeof item === "object" && item !== null && item.movieId) {
        return String(item.movieId); 
      }
      return String(item); 
    });

    const movies = await Movie.find({ _id: { $in: movieIds } });

    res.status(200).json({
      success: true,
      message: "Favorite movies fetched successfully!",
      movies,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error); 
    res.status(500).json({ success: false, message: error.message });
  }
};
