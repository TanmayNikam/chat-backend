const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createChat,
  getAllChats,
  clearUnreadMessages,
  updateGroup,
  clearGroupMessages,
} = require("../controllers/chats");

router.post("/create-new-chat", authMiddleware, createChat);

router.get("/get-all-chats", authMiddleware, getAllChats);

router.post("/clear-unread-messages", authMiddleware, clearUnreadMessages);

router.patch(
  "/clear-group-unread-messages",
  authMiddleware,
  clearGroupMessages
);

router.patch("/update-group", authMiddleware, updateGroup);

module.exports = router;
