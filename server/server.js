import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./config/connectDB.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { clerkMiddleware } from "@clerk/express";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhook.js";

const app = express();

//PORT
const PORT = process.env.PORT || 4050;

//Coonet MongoDb
await connectDB();

//Stripe Webhook Route
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

//MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

//GENRAL ROUTES
app.get("/", (req, res) => {
  res.send("Server is Working!");
});
app.use("/api/inngest", serve({ client: inngest, functions }));

// API ROUTES
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () =>
  console.log(`Server is running on  http://localhost:${PORT}`)
);
