// import Person from "../models/person.model.js";
// import cloudinary from "../utils/cloudinary.js";
// import fs from "fs";

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
//     res.json({ message: "Person deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



import Person from "../models/person.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import { broadcastNewMember, broadcastDeletedMember } from "../utils/websocket.js";

export const getPeople = async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addPerson = async (req, res) => {
  try {
    let photoUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "family_tree",
      });
      photoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const person = await Person.create({
      name: req.body.name,
      relation: req.body.relation,
      side: req.body.side,
      photo: photoUrl,
    });

    // ✅ Broadcast new member to all connected clients
    broadcastNewMember(person);

    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ error: "Person not found" });

    // Delete photo from Cloudinary if exists
    if (person.photo) {
      const publicId = person.photo.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`family_tree/${publicId}`);
    }

    await person.deleteOne();
    
    // ✅ Broadcast deleted member to all connected clients
    broadcastDeletedMember(req.params.id);

    res.json({ message: "Person deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};