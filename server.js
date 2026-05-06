

//server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import imageRoutes from "./routes/image.route.js";
import peopleRoutes from "./routes/people.route.js";
import weddingRoutes from "./routes/wedding.route.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createWebSocketServer } from "./utils/websocket.js";
import { createServer } from "http";
import mongoose from "mongoose";

// Load env
dotenv.config();

// DB
connectDB();

const app = express();
const server = createServer(app);

// ✅ VERY IMPORTANT — CORS FIRST
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://weeding-family-tree.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(domain =>
      allowedOrigins.includes(origin)
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));



// ✅ SECURITY
app.use(helmet({
  contentSecurityPolicy: false,
}));

// ✅ LOGGING
app.use(morgan("dev"));

// ✅ BODY PARSER

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// ✅ DEBUG LOGGER
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ HEALTH
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

// ✅ ROUTES
app.use("/api/images", imageRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/weddings", weddingRoutes);

// ✅ WEBSOCKET
createWebSocketServer(server);

// ✅ MONGODB LOGS
mongoose.connection.on("error", console.error);

// ✅ START SERVER
const PORT = process.env.PORT || 8000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${PORT}`);
});