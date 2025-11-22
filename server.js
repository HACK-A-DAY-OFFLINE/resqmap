// Load environment variables
require("dotenv").config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

// Connect DB
const connectDB = require("./src/config/db.js");
connectDB();

// Imports
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Routes
const authRoutes = require("./src/routes/authRoutes.js");
const reportRoutes = require("./src/routes/reportRoutes.js");
const uploadRoutes = require("./src/routes/uploadRoutes.js");

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, slow down buddy 🚫",
});
app.use("/api", limiter);


// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ResQMap backend is alive 🔥" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);

// ❗ REMOVED GLOBAL ERROR HANDLER — this caused “next is not a function”

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
