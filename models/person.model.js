import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  relation: String,
  side: { type: String, enum: ['groom', 'bride'], required: true },
  gender: { type: String, enum: ['male', 'female'] },
  email: String,
  phone: String,
  parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
  spouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }]
}, { timestamps: true });



export default mongoose.model("Person", personSchema);
