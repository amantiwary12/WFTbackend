import Image from "../models/image.model.js";
import cloudinary from "../utils/cloudinary.js";

export const deleteExpiredImages = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const expiredImages = await Image.find({ uploadedAt: { $lt: sevenDaysAgo } });

  for (const img of expiredImages) {
    try {
      await cloudinary.uploader.destroy(img.public_id);
      await img.deleteOne();
      console.log(`🧹 Deleted expired image: ${img.public_id}`);
    } catch (err) {
      console.error("Error deleting image:", err.message);
    }
  }
};
