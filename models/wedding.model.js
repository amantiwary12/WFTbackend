//wedding.model.js
import mongoose from "mongoose";

const weddingSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true
  },
  groomName: { 
    type: String, 
    required: true 
  },
  brideName: { 
    type: String, 
    required: true 
  },
  weddingDate: Date,
  createdBy: {
    type: String,
    default: "Anonymous"
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});


// ✅ KEEP THIS VALIDATION (optional)
weddingSchema.path('code').validate(function(value) {
  return value && value.trim().length > 0;
}, 'Code cannot be empty');

export default mongoose.model("Wedding", weddingSchema);