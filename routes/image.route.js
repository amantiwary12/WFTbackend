import express from "express";
import upload from "../middlewares/multer.middleware.js";
import { uploadImage, deleteImage, getImages } from "../controllers/image.controller.js";

const router = express.Router();

// POST /api/images/upload
router.post("/upload", upload.single("image"), uploadImage);

// GET /api/images/
router.get("/", getImages);

// DELETE /api/images/:id
router.delete("/:id", deleteImage);

export default router;
