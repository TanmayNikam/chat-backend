const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createChat,
  getAllChats,
  clearUnreadMessages,
} = require("../controllers/chats");

router.post("/create-new-chat", authMiddleware, createChat);

router.get("/get-all-chats", authMiddleware, getAllChats);

router.post("/clear-unread-messages", authMiddleware, clearUnreadMessages);

module.exports = router;
