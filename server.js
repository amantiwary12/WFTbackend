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


// app.use(cors({
//   origin: function (origin, callback) {

//     if (!origin) return callback(null, true);
    
//      if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("CORS policy: Origin not allowed"), false);
//     },


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
// if (typeof autoDeleteOldImages === "function") {
//   setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
// }



import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import imageRoutes from "./routes/image.route.js";
import peopleRoutes from "./routes/people.route.js";
import cors from "cors";
import helmet from 'helmet';
import morgan from 'morgan';
import { autoDeleteOldImages } from "./controllers/image.controller.js";
import { createWebSocketServer } from "./utils/websocket.js";
import { Server } from 'http';

dotenv.config();
connectDB();

const app = express();
const server = Server(app); // Create HTTP server

// ✅ Enhanced CORS with logging
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://weeding-family-tree.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS policy: Origin not allowed"), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Initialize WebSocket server
createWebSocketServer(server);

// Health check endpoint to verify CORS
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Backend is running with WebSocket support!",
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use("/api/images", imageRoutes);
app.use("/api/people", peopleRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("✅ WebSocket server initialized");
  console.log("✅ CORS configured for:", allowedOrigins);
});


// Handle WebSocket connections on /ws path///////////////////////////////////////////////////////////
app.get('/ws', (req, res) => {
  res.status(426).json({ error: 'WebSocket upgrade required' });
});

// Auto delete images
if (typeof autoDeleteOldImages === "function") {
  setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
}