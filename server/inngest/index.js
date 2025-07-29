import { Inngest } from "inngest";
import sendEmail from "../config/nodeMailer.js";
import Booking from "../models/bookingModel.js";
import Show from "../models/showModel.js";
import User from "../models/userModel.js";

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
            <li style="margin-bottom: 10px; font-size: 16px; color: #555;"><strong style="color: #333;">Show Date:</strong> ${new Date(
              booking.show.showDateTime
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</li>
            <li style="margin-bottom: 10px; font-size: 16px; color: #555;"><strong style="color: #333;">Show Time:</strong> ${new Date(
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
          <p style="margin: 5px 0 0;">Thank for booking with us!😊 <br/>QuickShow Team</p>
        </div>
      </div>
    `,
    });
  }
);

// Inngest function to send movie show reminder
const sendShowReminder = inngest.createFunction(
  { id: "send-show-reminder-email" },
  { cron: "0 */8 * * *" }, // Every 8 hours
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000); // Add 8 hours to the current time
    const windowStart = new Date(now.getTime() - 10 * 60 * 1000); // Subtract 10 minutes from the current time

    // Prepare reminder tasks
    const reminderTask = await step.run("prepare-reminder-tasks", async () => {
      const shows = await Show.find({
        showDateTime: { $gte: windowStart, $lte: in8Hours },
      }).populate("movie");

      const tasks = [];

      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;

        const userIds = [...new Set(Object.values(show.occupiedSeats))];
        if (userIds.length === 0) continue;

        const users = await User.find({ _id: { $in: userIds } }).select(
          "name email"
        );

        for (const user of users) {
          // Filter occupiedSeats to get seats specific to the user
          const userSeats = Object.keys(show.occupiedSeats).filter(
            (seat) =>
              show.occupiedSeats[seat] &&
              show.occupiedSeats[seat].toString() === user._id.toString()
          );

          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showDateTime: show.showDateTime,
            seatInfo: userSeats.join(", "), // User's specific seats
          });
        }
      }
      return tasks;
    });

    if (reminderTask.length === 0) {
      return { sent: 0, message: "No shows to send reminder for" };
    }

    // Send reminder emails
    const results = await step.run("send-reminder-emails", async () => {
      return await Promise.all(
        reminderTask.map((task) => {
          // Format show time and date for display
          const formattedShowDate = new Date(
            task.showDateTime
          ).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const formattedShowTime = new Date(
            task.showDateTime
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          const emailBody = `
            <div style="font-family: 'Inter', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: 20px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
                <h2 style="color: #333333; text-align: center; margin-bottom: 20px;">🎬 Your Movie Show Reminder!</h2>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                  Dear <strong style="color: #007bff;">${
                    task.userName || "Movie Lover"
                  }</strong>,
                </p>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                  Get ready for an exciting cinematic experience! This is a friendly reminder for your upcoming movie:
                </p>
                <div style="background-color: #e9f7ff; border-left: 5px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 5px;">
                  <h3 style="color: #007bff; margin-top: 0; margin-bottom: 10px;">"${
                    task.movieTitle
                  }"</h3>
                  <p style="margin: 5px 0; color: #333333;"><strong>🗓️ Date:</strong> ${formattedShowDate}</p>
                  <p style="margin: 5px 0; color: #333333;"><strong>⏰ Time:</strong> ${formattedShowTime}</p>
                  <p style="margin: 5px 0; color: #333333;"><strong>🪑 Your Seats:</strong> ${
                    task.seatInfo
                  }</p>
                </div>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                  We hope you have a fantastic time enjoying <strong style="color: #007bff;">"${
                    task.movieTitle
                  }"</strong>!
                </p>
                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-top: 25px;">
                  <strong>A few quick tips for a smooth experience:</strong>
                </p>
                <ul style="color: #555555; font-size: 15px; line-height: 1.6; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Please arrive at least 15-20 minutes before the showtime.</li>
                  <li style="margin-bottom: 8px;">Don't forget your tickets (digital or printed)!</li>
                  <li>Check the cinema's website or app for any last-minute updates.</li>
                </ul>
                <p style="color: #555555; font-size: 16px; line-height: 1.6; text-align: center; margin-top: 30px;">
                  Enjoy the movie!
                </p>
                <p style="color: #777777; font-size: 14px; text-align: center; margin-top: 40px;">
                  Best regards,<br>
                  From: QuickShow Team<br>
                  <a href="[Your Website/App Link]" style="color: #007bff; text-decoration: none;">[Your Website/App Link]</a>
                </p>
              </div>
            </div>
          `;

          return sendEmail({
            to: task.userEmail,
            subject: `Reminder: Your Movie Show of "${task.movieTitle}" starts soon!`,
            body: emailBody,
          });
        })
      );
    });

    const sent = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s).${failed} failed.`,
    };
  }
);

// Inngest Function to send notifications when a new show is added
const sendNewShowNotifications = inngest.createFunction(
  { id: "send-new-show-notifications" },
  { event: "app/show.added" },

  async ({ event }) => {
    const { movieTitle } = event.data;

    const users = await User.find({});

    for (const user of users) {
      const userEmail = user.email;
      const userName = user.name;

      const subject = `🎬 New Show Added: "${movieTitle}"`;
      const body = `
            <div style="font-family: 'Inter', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: 20px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
                <h2 style="color: #333333; text-align: center; margin-bottom: 20px;">✨ Exciting News from QuickShow! ✨</h2>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                  Dear <strong style="color: #007bff;">${
                    userName || "Movie Lover"
                  }</strong>,
                </p>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                  We're thrilled to announce that a new show has been added to our lineup!
                </p>
                <div style="background-color: #e9f7ff; border-left: 5px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center;">
                  <h3 style="color: #007bff; margin-top: 0; margin-bottom: 10px;">Now Showing: "${movieTitle}"</h3>
                  <p style="margin: 5px 0; color: #333333; font-size: 15px;">
                    Get ready to experience this amazing movie on the big screen!
                  </p>
                </div>
                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-top: 25px;">
                  Check out the showtimes and book your tickets now to secure your spot!
                </p>
                <p style="color: #555555; font-size: 16px; line-height: 1.6; text-align: center; margin-top: 30px;">
                  We can't wait to see you at the movies!
                </p>
                <p style="color: #777777; font-size: 14px; text-align: center; margin-top: 40px;">
                  Best regards,<br>
                  From: QuickShow Team
                </p>
              </div>
            </div>
          `;
      await sendEmail({
        to: userEmail,
        subject: subject,
        body: body,
      });
    }

    return { message: `Notification sent` };
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendConfirmationEmail,
  sendShowReminder,
  sendNewShowNotifications,
];
