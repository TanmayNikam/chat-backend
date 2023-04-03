const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

exports.createChat = async (req, res) => {
  try {
    const newChat = new Chat(req.body);
    const savedChat = await newChat.save();

    await savedChat.populate("members");
    res.send({
      success: true,
      message: "Chat created successfully",
      data: savedChat,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error creating chat",
      error: error.message,
    });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: {
        $in: [req.body.userId],
      },
    })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.send({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error fetching chats",
      error: error.message,
    });
  }
};

exports.clearUnreadMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.body.chat);
    if (!chat) {
      return res.send({
        success: false,
        message: "Chat not found",
      });
    }
    const updatedChat = await Chat.findByIdAndUpdate(
      req.body.chat,
      {
        unreadMessages: 0,
      },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");

    // find all unread messages of this chat and update them to read
    await Message.updateMany(
      {
        chat: req.body.chat,
        read: false,
      },
      {
        read: true,
      }
    );
    res.send({
      success: true,
      message: "Unread messages cleared successfully",
      data: updatedChat,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error clearing unread messages",
      error: error.message,
    });
  }
};

exports.clearGroupMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.body.chat);
    if (!chat) {
      return res.send({
        success: false,
        message: "Chat not found",
      });
    }
    await Message.updateMany(
      {
        chat: req.body.chat,
        read: false,
      },
      {
        $pull: { readBy: req.body.usr },
      }
    );
    await Message.updateMany(
      {
        chat: req.body.chat,
        read: false,
        readBy: {
          $size: 0,
        },
      },
      {
        read: true,
      }
    );

    res.send({
      success: true,
      message: "Unread messages cleared successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error clearing unread messages",
      error: error.message,
    });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const chat = req.body.chat;
    const newChat = await Chat.findByIdAndUpdate(
      req.body.chat._id,
      { name: chat.name, members: chat.members },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");
    res.status(200).json({
      message: "Group updated successfully",
      data: newChat,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error clearing unread messages",
      error: error.message,
    });
  }
};
