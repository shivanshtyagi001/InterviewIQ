import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

dotenv.config();

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const corsOptions = {
    origin: "https://interviewiq-dmoc.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

/* CORS middleware */
app.use(cors(corsOptions));

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());
app.use(cookieParser());

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
    res.status(200).send("InterviewIQ Backend is running");
});

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    connectDb();
});