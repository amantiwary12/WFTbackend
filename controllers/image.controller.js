import cloudinary from "../utils/cloudinary.js";
import Image from "../models/image.model.js";
import fs from "fs";

// Upload image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    const image = await Image.create({
      public_id: result.public_id,
      url: result.secure_url,
    });

    fs.unlinkSync(req.file.path); // Remove temp file
    res.status(200).json({ success: true, image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all images
export const getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete image manually
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await cloudinary.uploader.destroy(image.public_id);
    await image.deleteOne();

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Auto delete images older than 7 days (runs every 6 hours)
export const autoDeleteOldImages = async () => {
  try {
    const limitDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const oldImages = await Image.find({ uploadedAt: { $lt: limitDate } });

    for (const img of oldImages) {
      await cloudinary.uploader.destroy(img.public_id);
      await img.deleteOne();
      console.log(`🧹 Deleted old image: ${img.public_id}`);
    }
  } catch (err) {
    console.error("Error auto-deleting old images:", err.message);
  }
};
