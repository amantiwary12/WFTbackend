// import Person from "../models/person.model.js";
// import cloudinary from "../utils/cloudinary.js";
// import fs from "fs";
// import { broadcastNewMember, broadcastDeletedMember } from "../utils/websocket.js";

// export const getPeople = async (req, res) => {
//   try {
//     const people = await Person.find();
//     res.json(people);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const addPerson = async (req, res) => {
//   try {
//     let photoUrl = "";

//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "family_tree",
//       });
//       photoUrl = result.secure_url;
//       fs.unlinkSync(req.file.path);
//     }

//     const person = await Person.create({
//       name: req.body.name,
//       relation: req.body.relation,
//       side: req.body.side,
//       photo: photoUrl,
//     });

//     // ✅ Broadcast new member to all connected clients
//     broadcastNewMember(person);

//     res.status(201).json(person);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const deletePerson = async (req, res) => {
//   try {
//     const person = await Person.findById(req.params.id);
//     if (!person) return res.status(404).json({ error: "Person not found" });

//     // Delete photo from Cloudinary if exists
//     if (person.photo) {
//       const publicId = person.photo.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(`family_tree/${publicId}`);
//     }

//     await person.deleteOne();

//     // ✅ Broadcast deleted member to all connected clients
//     broadcastDeletedMember(req.params.id);

//     res.json({ message: "Person deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };






// for multiple user in same time wedding

// import Person from "../models/person.model.js";
// import Wedding from "../models/wedding.model.js";
// import cloudinary from "../utils/cloudinary.js";
// import fs from "fs";
// import {
//   broadcastNewMember,
//   broadcastDeletedMember,
// } from "../utils/websocket.js";

// export const getPeople = async (req, res) => {
//   try {
//     const { weddingCode } = req.query;

//     console.log("🔍 GET /api/people - Wedding Code:", weddingCode); // ✅ ADD LOG

//     if (!weddingCode) {
//       console.log("❌ No wedding code provided");
//       return res.status(400).json({ error: "Wedding code is required" });
//     }

//     const people = await Person.find({ weddingCode });

//     console.log(`✅ Found ${people.length} people for wedding: ${weddingCode}`); // ✅ ADD LOG

//     res.json(people);
//   } catch (err) {
//     console.error("❌ Error in getPeople:", err.message); // ✅ ADD LOG
//     res.status(500).json({ error: err.message });
//   }
// };

// export const addPerson = async (req, res) => {
//   try {
//     const { weddingCode, name, relation, side } = req.body;

//     console.log("🔍 POST /api/people - Wedding Code:", weddingCode); // ✅ ADD LOG
//     console.log("📝 Person Data:", { name, relation, side }); // ✅ ADD LOG

//     if (!weddingCode) {
//       console.log("❌ No wedding code in request body");
//       return res.status(400).json({ error: "Wedding code is required" });
//     }

//     // Verify wedding exists
//     const wedding = await Wedding.findOne({
//       code: weddingCode,
//       isActive: true,
//     });
//     if (!wedding) {
//       console.log("❌ Wedding not found:", weddingCode);
//       return res.status(404).json({ error: "Wedding not found or inactive" });
//     }

//     let photoUrl = "";

//     if (req.file) {
//       console.log("📸 Processing photo upload");
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: `family_tree/${weddingCode}`,
//       });
//       photoUrl = result.secure_url;
//       fs.unlinkSync(req.file.path);
//     }

//     const person = await Person.create({
//       name,
//       relation,
//       side,
//       photo: photoUrl,
//       weddingCode,
//     });

//     console.log("✅ Person created successfully:", person._id);

//     broadcastNewMember(person);

//     res.status(201).json(person);
//   } catch (err) {
//     console.error("❌ Error in addPerson:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };
// export const deletePerson = async (req, res) => {
//   try {
//     const person = await Person.findById(req.params.id);
//     if (!person) return res.status(404).json({ error: "Person not found" });

    

//     // Delete photo from Cloudinary if exists
//     if (person.photo) {
//       const publicId = person.photo.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(
//         `family_tree/${person.weddingCode}/${publicId}`
//       );
//     }

//     const weddingCode = person.weddingCode;
//     await person.deleteOne();

//     broadcastDeletedMember(req.params.id, weddingCode);
//     res.json({ message: "Person deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };








// import Person from "../models/person.model.js";
// import Wedding from "../models/wedding.model.js";
// import cloudinary from "../utils/cloudinary.js";
// import fs from "fs";
// import {
//   broadcastNewMember,
//   broadcastDeletedMember,
// } from "../utils/websocket.js";

// /**
//  * =========================
//  * GET ALL PEOPLE (NO CHANGE)
//  * =========================
//  */
// export const getPeople = async (req, res) => {
//   try {
//     const { weddingCode } = req.query;

//     console.log("🔍 GET /api/people - Wedding Code:", weddingCode);

//     if (!weddingCode) {
//       return res.status(400).json({ error: "Wedding code is required" });
//     }

//     const people = await Person.find({ weddingCode });

//     console.log(`✅ Found ${people.length} people`);

//     res.json(people);
//   } catch (err) {
//     console.error("❌ Error in getPeople:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// /**
//  * =========================
//  * ADD PERSON (🔥 MAIN FIX)
//  * =========================
//  *
//  * NEW FEATURES:
//  * - parentId support
//  * - auto link child → parent
//  * - works even if parents don't exist
//  */
// export const addPerson = async (req, res) => {
//   try {
//     const {
//       weddingCode,
//       name,
//       relation,
//       side,
//       parentId, // 🔥 NEW (IMPORTANT)
//     } = req.body;

//     console.log("🔍 POST /api/people");
//     console.log("📝 Data:", { name, relation, side, parentId });

//     if (!weddingCode || !name || !side) {
//       return res.status(400).json({
//         error: "weddingCode, name and side are required",
//       });
//     }

//     // ✅ Verify wedding
//     const wedding = await Wedding.findOne({
//       code: weddingCode,
//       isActive: true,
//     });

//     if (!wedding) {
//       return res.status(404).json({ error: "Wedding not found or inactive" });
//     }

//     /**
//      * PHOTO UPLOAD (NO CHANGE)
//      */
//     let photoUrl = "";
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: `family_tree/${weddingCode}`,
//       });
//       photoUrl = result.secure_url;
//       fs.unlinkSync(req.file.path);
//     }

//     /**
//      * =========================
//      * CREATE PERSON
//      * =========================
//      */
//     const person = await Person.create({
//       name,
//       relation,
//       side,
//       photo: photoUrl,
//       weddingCode,
//       parents: parentId ? [parentId] : [], // 🔥 KEY CHANGE
//     });

//     /**
//      * =========================
//      * LINK CHILD → PARENT
//      * =========================
//      */
//     if (parentId) {
//       await Person.findByIdAndUpdate(parentId, {
//         $addToSet: { children: person._id }, // prevents duplicates
//       });
//     }

//     console.log("✅ Person created:", person._id);

//     broadcastNewMember(person);
//     res.status(201).json(person);
//   } catch (err) {
//     console.error("❌ Error in addPerson:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// /**
//  * =========================
//  * DELETE PERSON (IMPROVED)
//  * =========================
//  */
// export const deletePerson = async (req, res) => {
//   try {
//     const person = await Person.findById(req.params.id);

//     if (!person) {
//       return res.status(404).json({ error: "Person not found" });
//     }

//     /**
//      * REMOVE FROM PARENTS' CHILDREN
//      */
//     if (person.parents?.length) {
//       await Person.updateMany(
//         { _id: { $in: person.parents } },
//         { $pull: { children: person._id } }
//       );
//     }

//     /**
//      * REMOVE FROM CHILDREN'S PARENTS
//      */
//     if (person.children?.length) {
//       await Person.updateMany(
//         { _id: { $in: person.children } },
//         { $pull: { parents: person._id } }
//       );
//     }

//     /**
//      * DELETE PHOTO
//      */
//     if (person.photo) {
//       const publicId = person.photo.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(
//         `family_tree/${person.weddingCode}/${publicId}`
//       );
//     }

//     const weddingCode = person.weddingCode;
//     await person.deleteOne();

//     broadcastDeletedMember(req.params.id, weddingCode);

//     res.json({ message: "Person deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting person:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };





// import Person from "../models/person.model.js";

// /* ===========================
//    GET ALL PEOPLE
// =========================== */
// export const getPeople = async (req, res) => {
//   try {
//     const { weddingCode } = req.query;

//     if (!weddingCode) {
//       return res.status(400).json({ error: "Wedding code required" });
//     }

//     const people = await Person.find({ weddingCode });
//     res.json(people);
//   } catch (err) {
//     console.error("GET PEOPLE ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ===========================
//    ADD PERSON
// =========================== */
// export const addPerson = async (req, res) => {
//   try {
//     const { name, relation, side, weddingCode } = req.body;

//     // 🔥 FIX: parse parents correctly
//     let parents = [];
//     if (req.body.parents) {
//       parents = JSON.parse(req.body.parents); // convert string → array
//     }

//     if (!name || !side || !weddingCode) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // ✅ CREATE PERSON
//     const person = await Person.create({
//       name,
//       relation,
//       side,
//       weddingCode,
//       parents,
//       photo: req.file?.filename || "",
//     });

//     // 🔗 LINK CHILD TO PARENTS
//     if (parents.length > 0) {
//       await Person.updateMany(
//         { _id: { $in: parents } },
//         { $addToSet: { children: person._id } }
//       );
//     }

//     res.status(201).json(person);
//   } catch (err) {
//     console.error("ADD PERSON ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ===========================
//    DELETE PERSON
// =========================== */
// export const deletePerson = async (req, res) => {
//   try {
//     const person = await Person.findById(req.params.id);
//     if (!person) {
//       return res.status(404).json({ error: "Not found" });
//     }

//     // Remove from parents
//     await Person.updateMany(
//       { parents: person._id },
//       { $pull: { parents: person._id } }
//     );

//     // Remove from children
//     await Person.updateMany(
//       { children: person._id },
//       { $pull: { children: person._id } }
//     );

//     await person.deleteOne();

//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     console.error("DELETE PERSON ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



// people.controler.js
import Person from "../models/person.model.js";
import cloudinary from "../utils/cloudinary.js";
import { broadcastNewMember, broadcastDeletedMember } from "../utils/websocket.js";
import fs from "fs";
import mongoose from "mongoose";


export const getPeople = async (req, res) => {
  try {
    const { weddingCode } = req.query;
    if (!weddingCode) return res.status(400).json({ error: "Wedding code required" });

    const people = await Person.find({ weddingCode });
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const addPerson = async (req, res) => {
  try {
    let { name, relation, side, weddingCode, parents } = req.body;

    if (!name || !relation || !side || !weddingCode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let photoUrl = "";
    let cloudinaryId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "family_tree_photos",
      });

      photoUrl = result.secure_url;
      cloudinaryId = result.public_id;

      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }

    // 🔥 Safe ObjectId filtering
    let parsedParents = [];

    if (parents) {
      try {
        const rawParents =
          typeof parents === "string" && parents.trim() !== ""
            ? JSON.parse(parents)
            : parents;

        if (Array.isArray(rawParents)) {
          parsedParents = rawParents.filter(id =>
            mongoose.Types.ObjectId.isValid(id)
          );
        }
      } catch {}
    }

    const person = await Person.create({
      name,
      relation,
      side,
      weddingCode,
      parents: parsedParents,
      photo: photoUrl,
      cloudinaryId,
    });

    broadcastNewMember(person);

    res.status(201).json({ success: true, person });

  } catch (err) {
    console.error("AddPerson Error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);
    if (!person) return res.status(404).json({ error: "Person not found" });

    // 2. DELETE FROM CLOUDINARY
    if (person.cloudinaryId) {
      await cloudinary.uploader.destroy(person.cloudinaryId);
    }

    const weddingCode = person.weddingCode;
    await Person.updateMany({ parents: id }, { $pull: { parents: id } });
    await person.deleteOne();

    broadcastDeletedMember(id, weddingCode);
    res.json({ success: true, message: "Deleted from DB and Cloudinary" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addSpouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { spouseId } = req.body;

    if (!spouseId) {
      return res.status(400).json({ error: "Spouse ID required" });
    }

    const person = await Person.findById(id);
    const spouse = await Person.findById(spouseId);

    if (!person || !spouse) {
      return res.status(404).json({ error: "Person not found" });
    }

    person.spouse = spouseId;
    spouse.spouse = id;

    await person.save();
    await spouse.save();

    res.json({ success: true, message: "Spouse linked successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
