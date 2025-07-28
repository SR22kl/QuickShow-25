import stripe from "stripe";
import Booking from "../models/bookingModel.js";

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(
      "[Stripe Webhook] Signature verification failed:",
      err.message
    );
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event based on its type
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log(
          `[Stripe Webhook] Payment Intent Succeeded: ${paymentIntentSucceeded.id}. Processing booking update.`
        );

        const sessionListSucceeded =
          await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentSucceeded.id,
          });

        // Ensure a Checkout Session was found
        if (sessionListSucceeded.data.length === 0) {
          console.warn(
            `[Stripe Webhook] No checkout session found for payment_intent.succeeded with ID: ${paymentIntentSucceeded.id}. Skipping booking update.`
          );
          return response
            .status(200)
            .json({ received: true, message: "No associated session found." });
        }

        const sessionSucceeded = sessionListSucceeded.data[0];

        // Ensure metadata and 'bookingId' exist
        if (
          !sessionSucceeded.metadata ||
          !sessionSucceeded.metadata.bookingId
        ) {
          console.warn(
            `[Stripe Webhook] 'bookingId' not found in metadata for successful session ID: ${sessionSucceeded.id}. Skipping booking update.`
          );
          return response.status(200).json({
            received: true,
            message: "Booking ID not found in session metadata.",
          });
        }
        const { bookingId } = sessionSucceeded.metadata;

        await Booking.findByIdAndUpdate(
          bookingId,
          {
            isPaid: true,
            paymentLink: "",
            paymentStatus: "succeeded",
          },
          { new: true }
        );

        console.log(
          `[Stripe Webhook] Booking ${bookingId} successfully updated: isPaid=true, paymentStatus='succeeded'.`
        );
        break;

      case "payment_intent.payment_failed":
        const paymentFailedIntent = event.data.object;
        console.log(
          `[Stripe Webhook] Payment Intent Failed: ${paymentFailedIntent.id}. Processing booking update.`
        );

        const sessionListFailed = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentFailedIntent.id,
        });

        //Ensure a Checkout Session was found
        if (sessionListFailed.data.length === 0) {
          console.warn(
            `[Stripe Webhook] No checkout session found for payment_intent.payment_failed with ID: ${paymentFailedIntent.id}. Skipping booking update.`
          );
          return response.status(200).json({
            received: true,
            message: "No associated session found for failed payment.",
          });
        }

        const sessionFailed = sessionListFailed.data[0];

        //Ensure metadata and 'bookingId' exist
        if (!sessionFailed.metadata || !sessionFailed.metadata.bookingId) {
          console.warn(
            `[Stripe Webhook] 'bookingId' not found in metadata for failed session ID: ${sessionFailed.id}. Skipping booking update.`
          );
          return response.status(200).json({
            received: true,
            message: "Booking ID not found in session metadata.",
          });
        }
        const { bookingId: bookingIdFailed } = sessionFailed.metadata;

        await Booking.findByIdAndUpdate(
          bookingIdFailed,
          {
            isPaid: false,
            paymentLink: "",
            paymentStatus: "failed",
          },
          { new: true }
        );

        console.log(
          `[Stripe Webhook] Booking ${bookingIdFailed} updated: isPaid=false, paymentStatus='failed'.`
        );
        break;

      default:
        console.log(
          `[Stripe Webhook] Unhandled event type: ${event.type}. Event ID: ${event.id}`
        );
    }

    response.status(200).json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Internal processing error:", error);
    return response
      .status(400)
      .send("Internal Server Error during webhook processing.");
  }
};
