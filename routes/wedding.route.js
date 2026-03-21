// import express from "express";
// import { createWedding, getWedding, deactivateWedding } from "../controllers/wedding.controller.js";

// const router = express.Router();

// // POST /api/weddings - Create new wedding
// router.post("/", createWedding);

// // GET /api/weddings/:code - Get wedding details
// router.get("/:code", getWedding);

// // PUT /api/weddings/:code/deactivate - Deactivate wedding
// router.put("/:code/deactivate", deactivateWedding);

// export default router;



//wedding.route.js
import express from "express";
import { createWedding, getWedding, deactivateWedding } from "../controllers/wedding.controller.js";

const router = express.Router();

// ✅ FIXED TEMPORARY TEST ROUTE (removed unnecessary async/await)
router.post("/test", (req, res) => {
  try {
    const wedding = {
      code: 'test123',
      groomName: 'Test Groom',
      brideName: 'Test Bride',
      createdBy: 'Tester'
    };
    res.json({ success: true, wedding, message: "Test route working" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/weddings - Create new wedding
router.post("/", createWedding);

// GET /api/weddings/:code - Get wedding details
router.get("/:code", getWedding);

// PUT /api/weddings/:code/deactivate - Deactivate wedding
router.put("/:code/deactivate", deactivateWedding);

export default router;