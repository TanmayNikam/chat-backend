const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  register,
  login,
  getCurrentUser,
  updateProfilePicture,
  getAllUsers,
} = require("../controllers/users");

router.post("/register", register);

router.post("/login", login);

router.get("/get-current-user", authMiddleware, getCurrentUser);

router.get("/get-all-users", authMiddleware, getAllUsers);

router.post("/update-profile-picture", authMiddleware, updateProfilePicture);

module.exports = router;
