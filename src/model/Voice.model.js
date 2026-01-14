import mongoose from "mongoose";

const voiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  voiceId: { type: String, required: false },
  voiceLink: { type: String, required: true }, // Cloudinary URL
  cloudinaryId: { type: String }, 
  format: { type: String }, // e.g., 'mp3', 'wav'
  size: { type: Number }, // File size in bytes
  duration: { type: Number }, // Seconds mein
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Voice", voiceSchema);