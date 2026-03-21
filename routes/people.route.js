// import express from "express";
// import multer from "../middlewares/multer.middleware.js";
// import { getPeople, addPerson, deletePerson } from "../controllers/people.controller.js";

// const router = express.Router();

// router.get("/", getPeople);
// router.post("/", multer.single("photo"), addPerson);
// router.delete("/:id", deletePerson);

// export default router;



//people.route.js
import express from "express";
import multer from "../middlewares/multer.middleware.js";
import { getPeople, addPerson, deletePerson,addSpouse} from "../controllers/people.controller.js";

const router = express.Router();

router.get("/", getPeople);
router.post("/", multer.single("photo"), addPerson); // "photo" must match frontend field
router.delete("/:id", deletePerson);
// routes/people.route.js - Add these
router.post("/:id/spouse", addSpouse);
// router.post("/:id/child", addChild);
// router.post("/:id/parent", addParent);
// router.put("/reorder", reorderMembers); // For drag-drop
// router.get("/tree/:weddingCode", getFullTree); // Get hierarchical structure

export default router;