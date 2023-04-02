const router = require("express").Router();
const { newMessage, getMessageByChat } = require("../controllers/messages");

router.post("/new-message", newMessage);


router.get("/get-all-messages/:chatId", getMessageByChat);

module.exports = router;
