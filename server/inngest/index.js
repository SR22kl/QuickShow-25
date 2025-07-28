import { Inngest } from "inngest";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import Show from "../models/showModel.js";
import sendEmail from "../config/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to save user data to the database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };
    await User.create(userData);
  }
);

// Inngest Function to delete user data from the database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Inngest Function to update the user data in the database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-with-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest function to cancle booking and elease seats of show after 10 min of booking created if payment is not done

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-and-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-10-min", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      // If payment is not done, release the seats and delete the booking
      if (!booking.isPaid) {
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });
        show.markModified("occupiedSeats");
        await show.save();
        await Booking.findByIdAndDelete(bookingId);
      }
    });
  }
);

// Inggest function to send confiramtion email when user books movie show

const sendConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "Movie",
        },
      })
      .populate("user");

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
      body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Movie Ticket Booking Confirmation</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Hi ${booking.user.name},</p>
          <p style="font-size: 16px; color: #333;">Thank you for booking a ticket for the movie "<strong style="color: #4CAF50;">${
            booking.show.movie.title
          }</strong>".</p>
          <p style="font-size: 16px; color: #333;">Here are the details of your booking:</p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px; font-size: 16px; color: #555;"><strong style="color: #333;">Movie:</strong> ${
              booking.show.movie.title
            }</li>
            <li style="margin-bottom: 10px; font-size: 16px; color: #555;"><strong style="color: #333;">Show:</strong> ${new Date(
              booking.show.showDateTime
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</li>
            <li style="margin-bottom: 10px; font-size: 16px; color: #555;"><strong style="color: #333;">Show:</strong> ${new Date(
              booking.show.showDateTime
            ).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}</li>
            <li style="margin-bottom: 10px; font-size: 16px; color: #555;"><strong style="color: #333;">Seats:</strong> <span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${booking.bookedSeats.join(
              ", "
            )}</span></li>
          </ul>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 14px; color: #777; border-top: 1px solid #ddd;">
          <p style="margin: 0;">Enjoy your movie! 🍿</p>
          <p style="margin: 5px 0 0;">Thank for booking with us!😊 <br/>- QuickShow Tema</p>
        </div>
      </div>
    `,
    });
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendConfirmationEmail,
];
