// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import imageRoutes from "./routes/image.route.js";
// import peopleRoutes from "./routes/people.route.js";
// import cors from "cors";
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { autoDeleteOldImages } from "./controllers/image.controller.js";


// dotenv.config();
// connectDB();

// const app = express();

// // ✅ Enhanced CORS with logging
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "https://weeding-family-tree.vercel.app",
// ];

// // console.log("🔄 CORS configured for origins:", allowedOrigins);

// app.use(cors({
//   origin: function (origin, callback) {
//     // console.log("🌐 Incoming request from origin:", origin);
    
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//      if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("CORS policy: Origin not allowed"), false);
//     },
//     // if (allowedOrigins.indexOf(origin) === -1) {
//     //   console.log("❌ CORS blocked origin:", origin);
//     //   const msg = 'CORS policy: Origin not allowed';
//     //   return callback(new Error(msg), false);
//     // }
//   //   console.log("✅ CORS allowed origin:", origin);
//   //   return callback(null, true);
//   // },


//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
// }));

// app.use(helmet());
// app.use(morgan("dev"));
// app.use(express.json());

// // Health check endpoint to verify CORS
// app.get("/api/health", (req, res) => {
//   res.json({ 
//     message: "Backend is running with updated CORS!",
//     timestamp: new Date().toISOString(),
//     allowedOrigins: allowedOrigins,
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// app.use("/api/images", imageRoutes);
// app.use("/api/people", peopleRoutes);

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log("✅ CORS configured for:", allowedOrigins);
// });

// // Auto delete images
// // setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
// if (typeof autoDeleteOldImages === "function") {
//   setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
// }




// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import imageRoutes from "./routes/image.route.js";
import peopleRoutes from "./routes/people.route.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { autoDeleteOldImages } from "./controllers/image.controller.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://weeding-family-tree.vercel.app", // <-- make sure spelling is correct
  // "https://your-vercel-domain-if-different.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "Backend + WebSocket running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/images", imageRoutes);
app.use("/api/people", peopleRoutes);

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  },
});

// WebSocket logging
io.on("connection", (socket) => {
  console.log("🟢 socket connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("🔴 socket disconnected:", socket.id, reason);
  });
});

// Make io available to controllers via req.app.get("io")
app.set("io", io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("💬 WebSocket ready");
});

// Auto delete images safe call
if (typeof autoDeleteOldImages === "function") {
  setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
}
