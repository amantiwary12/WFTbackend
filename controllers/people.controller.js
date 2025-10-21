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



// controllers/people.controller.js
import Person from "../models/person.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

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
    let photoPublicId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "family_tree",
      });
      photoUrl = result.secure_url;
      photoPublicId = result.public_id;
      try { fs.unlinkSync(req.file.path); } catch(e){/* ignore */ }
    }

    const person = await Person.create({
      name: req.body.name,
      relation: req.body.relation,
      side: req.body.side,
      photo: photoUrl,
      photoPublicId,
    });

    // Emit using app's io (safe get)
    const io = req.app.get("io");
    if (io) io.emit("personAdded", person);

    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ error: "Person not found" });

    // Delete cloudinary by saved public id (if available)
    if (person.photoPublicId) {
      try { await cloudinary.uploader.destroy(person.photoPublicId); } catch(e){ console.warn(e.message); }
    }

    await person.deleteOne();

    const io = req.app.get("io");
    if (io) io.emit("personDeleted", req.params.id);

    res.json({ message: "Person deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
