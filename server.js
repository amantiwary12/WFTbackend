// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import imageRoutes from "./routes/image.route.js";
// import peopleRoutes from "./routes/people.route.js";
// import cors from "cors";
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { autoDeleteOldImages } from "./controllers/image.controller.js";
// import { createWebSocketServer } from "./utils/websocket.js";
// import { Server } from 'http';

// dotenv.config();
// connectDB();

// const app = express();
// const server = Server(app); // Create HTTP server

// // ✅ Enhanced CORS with logging
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "https://weeding-family-tree.vercel.app",
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error("CORS policy: Origin not allowed"), false);
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
// }));

// app.use(helmet());
// app.use(morgan("dev"));
// app.use(express.json());

// // Initialize WebSocket server
// createWebSocketServer(server);

// // Health check endpoint to verify CORS
// app.get("/api/health", (req, res) => {
//   res.json({ 
//     message: "Backend is running with WebSocket support!",
//     timestamp: new Date().toISOString(),
//     allowedOrigins: allowedOrigins,
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// app.use("/api/images", imageRoutes);
// app.use("/api/people", peopleRoutes);

// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log("✅ WebSocket server initialized");
//   console.log("✅ CORS configured for:", allowedOrigins);
// });


// // Handle WebSocket connections on /ws path///////////////////////////////////////////////////////////
// app.get('/ws', (req, res) => {
//   res.status(426).json({ error: 'WebSocket upgrade required' });
// });

// // Auto delete images
// if (typeof autoDeleteOldImages === "function") {
//   setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
// }




// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import imageRoutes from "./routes/image.route.js";
// import peopleRoutes from "./routes/people.route.js";
// import weddingRoutes from "./routes/wedding.route.js";
// import cors from "cors";
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { autoDeleteOldImages } from "./controllers/image.controller.js";
// import { createWebSocketServer } from "./utils/websocket.js";
// import { createServer } from 'http';
// import mongoose from "mongoose"; // ✅ ADD THIS IMPORT

// dotenv.config();
// connectDB();

// const app = express();
// const server = createServer(app);

// // ✅ IMPROVED CORS CONFIGURATION
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "https://weeding-family-tree.vercel.app",
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       console.log('🚫 CORS blocked for origin:', origin);
//       return callback(new Error('Not allowed by CORS'), false);
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(helmet());
// app.use(morgan("dev"));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Initialize WebSocket server
// createWebSocketServer(server);

// // ✅ ADD CONNECTION TEST ENDPOINT
// app.get("/api/test-connection", (req, res) => {
//   res.json({
//     success: true,
//     message: "Backend is connected and responding!",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // ✅ ADD WEDDING CREATION TEST ENDPOINT
// app.post("/api/test-wedding", async (req, res) => {
//   try {
//     console.log('🧪 Test wedding endpoint - Body:', req.body);
    
//     // Simulate wedding creation without database
//     const testWedding = {
//       code: 'test123',
//       groomName: req.body.groomName || 'Test Groom',
//       brideName: req.body.brideName || 'Test Bride',
//       weddingDate: req.body.weddingDate || null,
//       createdBy: req.body.createdBy || 'Tester'
//     };
    
//     res.json({
//       success: true,
//       message: "Test wedding created successfully",
//       wedding: testWedding,
//       shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tree/test123`
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       error: error.message 
//     });
//   }
// });

// // Health check endpoint
// app.get("/api/health", (req, res) => {
//   res.json({ 
//     success: true,
//     message: "Backend is running with wedding support!",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development',
//     database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
//   });
// });

// // ✅ MAIN ROUTES
// app.use("/api/images", imageRoutes);
// app.use("/api/people", peopleRoutes);
// app.use("/api/weddings", weddingRoutes);

// // ✅ FIXED CATCH-ALL ROUTE FOR UNDEFINED ENDPOINTS
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: `Route not found: ${req.originalUrl}`
//   });
// });

// // ✅ ERROR HANDLING MIDDLEWARE
// app.use((err, req, res, next) => {
//   console.error('🚨 Server Error:', err);
//   res.status(500).json({
//     success: false,
//     error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
//   });
// });

// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log("✅ Wedding routes enabled");
//   console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
//   console.log(`✅ Connection test: http://localhost:${PORT}/api/test-connection`);
//   console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
// });

// // Auto delete images
// if (typeof autoDeleteOldImages === "function") {
//   setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
// }





// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import imageRoutes from "./routes/image.route.js";
// import peopleRoutes from "./routes/people.route.js";
// import weddingRoutes from "./routes/wedding.route.js";
// import cors from "cors";
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { autoDeleteOldImages } from "./controllers/image.controller.js";
// import { createWebSocketServer } from "./utils/websocket.js";
// import { createServer } from 'http';
// import mongoose from "mongoose";

// dotenv.config();
// connectDB();

// const app = express();
// const server = createServer(app);

// // ✅ PRODUCTION CORS CONFIGURATION
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000", 
//   "https://weeding-family-tree.vercel.app",
//   "https://weeding-family-tree-git-*.vercel.app",
//   "https://*.vercel.app"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.some(allowed => {
//       if (allowed.includes('*')) {
//         const regex = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
//         return regex.test(origin);
//       }
//       return allowed === origin;
//     })) {
//       return callback(null, true);
//     } else {
//       console.log('🚫 CORS blocked for origin:', origin);
//       return callback(new Error('Not allowed by CORS'), false);
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-wedding-code']
// }));

// // ✅ ENHANCED SECURITY FOR PRODUCTION
// app.use(helmet({
//   contentSecurityPolicy: false // Disable CSP for now, can configure later
// }));

// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Initialize WebSocket server
// const wss = createWebSocketServer(server);

// // WebSocket error handling
// wss.on('error', (error) => {
//   console.error('❌ WebSocket server error:', error);
// });

// // MongoDB connection events
// mongoose.connection.on('error', (err) => {
//   console.error('❌ MongoDB connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('⚠️ MongoDB disconnected');
// });

// // ... rest of your routes remain the same

// const PORT = process.env.PORT || 8000;

// // ✅ UPDATED FOR RENDER DEPLOYMENT
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`✅ Database: ${mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"}`);
//   console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
//   console.log(`✅ Backend URL: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}`);
// });

// // Auto delete images
// if (typeof autoDeleteOldImages === "function") {
//   setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
// }



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
import { autoDeleteOldImages } from "./controllers/image.controller.js";
import { createWebSocketServer } from "./utils/websocket.js";
import { createServer } from "http";
import mongoose from "mongoose";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);

// ✅ Simple health check route (fixes 404 issue)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy ✅",
    timestamp: new Date(),
  });
});

// app.use(cors());
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); // important
      } else {
        console.log("🚫 CORS blocked:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// ✅ Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for now (can be customized later)
  })
);

// ✅ Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ✅ Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ API routes
console.log("🚀 Mounting routes...");

app.use("/api/images", imageRoutes);
console.log("✅ Image routes mounted");

app.use("/api/people", peopleRoutes);
console.log("✅ People routes mounted");

app.use("/api/weddings", weddingRoutes);
console.log("✅ Wedding routes mounted");


// ✅ WebSocket setup
const wss = createWebSocketServer(server);
wss.on("error", (error) => {
  console.error("❌ WebSocket server error:", error);
});

// ✅ MongoDB connection monitoring
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

// ✅ Server start
const PORT = process.env.PORT || 8000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `✅ Database: ${
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    }`
  );
  console.log(
    `✅ Frontend URL: ${
      process.env.FRONTEND_URL || "http://localhost:5174"
    }`
  );
  console.log(
    `✅ Backend URL: ${
      process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`
    }`
  );
});
app.get("/test-route", (req, res) => {
  res.json({ message: "✅ Express routes working fine" });
});


// ✅ Auto delete old images every 6 hours
if (typeof autoDeleteOldImages === "function") {
  setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
}


// app.listen(8000,()=>{
//   console.log("Server running on por")
// })