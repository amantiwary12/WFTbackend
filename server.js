import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import imageRoutes from "./routes/image.route.js";
import peopleRoutes from "./routes/people.route.js";
import cors from "cors";
import { autoDeleteOldImages } from "./controllers/image.controller.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/api/images", imageRoutes);
app.use("/api/people", peopleRoutes); // ✅ People routes

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Auto delete images
setInterval(autoDeleteOldImages, 6 * 60 * 60 * 1000);
