import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./config/connectDB.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

//PORT
const PORT = process.env.PORT || 4050;

//Coonet MongoDb
await connectDB();

//MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

//ROUTES
app.get("/", (req, res) => {
  res.send("Server is Working!");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(PORT, () =>
  console.log(`Server is running on  http://localhost:${PORT}`)
);
