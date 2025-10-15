import express from "express";
import multer from "../middlewares/multer.middleware.js";
import { getPeople, addPerson, deletePerson } from "../controllers/people.controller.js";

const router = express.Router();

router.get("/", getPeople);
router.post("/", multer.single("photo"), addPerson);
router.delete("/:id", deletePerson);

export default router;
