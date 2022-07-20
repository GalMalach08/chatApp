const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  searchUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/", protect, searchUser);

module.exports = router;
