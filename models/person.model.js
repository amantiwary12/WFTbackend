// import mongoose from "mongoose";

// const personSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   photo: String,
//   relation: String,
//   side: { type: String, enum: ['groom', 'bride'], required: true },
//   gender: { type: String, enum: ['male', 'female'] },
//   email: String,
//   phone: String,
//   parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
//   spouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
//   children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }]
// }, { timestamps: true });

// export default mongoose.model("Person", personSchema);

//  for multiple user in same time wedding




// import mongoose from "mongoose";

// const personSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     photo: String,
//     relation: String,
//     side: { type: String, enum: ["groom", "bride"], required: true },
//     gender: { type: String, enum: ["male", "female"] },
//     email: String,
//     phone: String,
//     //----------------------------------------------------------------------------------
//     //new now
//     // parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
//     parents: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
//       validate: [(arr) => arr.length <= 2, "Max 2 parents allowed"],
//     },
//     //---------------------------------------------------------------------------------------
//     spouse: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
//     children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
//     // ✅ MAKE SURE THIS FIELD EXISTS
//     weddingCode: { type: String, required: true, index: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Person", personSchema);




// import mongoose from "mongoose";

// const personSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     photo: String,

//     // Just for label (UI)
//     relation: { type: String, required: true },

//     side: {
//       type: String,
//       enum: ["groom", "bride"],
//       required: true,
//     },

//     gender: {
//       type: String,
//       enum: ["male", "female"],
//     },

//     email: String,
//     phone: String,

//     // 🔥 CORE TREE STRUCTURE
//     parents: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
//       validate: [(v) => v.length <= 2, "Max 2 parents allowed"],
//       default: [],
//     },

//     children: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
//       default: [],
//     },

//     spouse: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Person",
//       default: null,
//     },

//     weddingCode: {
//       type: String,
//       required: true,
//       index: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Person", personSchema);




//person.model.js
import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String, 
  cloudinaryId: String, // Store the ID for deletion
  relation: { type: String, required: true },
  side: { type: String, enum: ["groom", "bride"], required: true },
  gender: { type: String, enum: ["male", "female"] },

  // Hierarchical fields
  // parentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }], // Changed from 'parents'
  // spouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  // childrenIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }], // For quick access
  generation: { type: Number, default: 0 }, // 0 = main person, -1 = parents, 1 = children
  orderIndex: { type: Number, default: 0 }, // For drag-drop ordering
  
  parents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
  weddingCode: { type: String, required: true, index: true },
children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
spouse: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
position: {
  x: Number,
  y: Number
}

}, { timestamps: true });

export default mongoose.model("Person", personSchema);