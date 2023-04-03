const express = require("express");
require("dotenv").config();
const app = express();
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT || 5000;
const cors = require("cors");
const morgan = require("morgan");

const usersRoute = require("./routes/usersRoute");
const chatsRoute = require("./routes/chatsRoute");
const messagesRoute = require("./routes/messagesRoute");
app.use(
  express.json({
    limit: "5mb",
  })
);
app.use(cors());
app.use(morgan("tiny"));

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://monumental-squirrel-cda728.netlify.app",
    methods: ["GET", "POST", "PATCH"],
  },
});

// check the connection of socket from client
let onlineUsers = [];

io.on("connection", (socket) => {
  // socket events will be here
  socket.on("join-room", (userId) => {
    socket.join(userId);
  });

  // send message to clients (who are present in members array)
  socket.on("send-message", (message) => {
    message.members.forEach((mem) => io.to(mem));
    io.emit("receive-message", message);
  });

  // clear unread messages
  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("unread-messages-cleared", data);
  });

  socket.on("clear-group-unread-messages", (data) => {
    data.members.forEach((mem) => io.to(mem));
    io.emit("unread-group-messages-cleared", data);
  });

  socket.on("typing", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("started-typing", data);
  });

  socket.on("came-online", (userId) => {
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }

    io.emit("online-users-updated", onlineUsers);
  });

  socket.on("went-offline", (userId) => {
    onlineUsers = onlineUsers.filter((user) => user !== userId);
    io.emit("online-users-updated", onlineUsers);
  });

  socket.on("add-group", (data) => {
    data.chat.members.forEach((mem) => {
      io.to(mem);
    });
    io.emit("new-group", data);
  });

  socket.on("edit-group", (data) => {
    let newMembers = data.chat.members.map((mem) => mem._id);
    let allMembers = Array.from(new Set([...data.members, ...newMembers]));
    allMembers.forEach((mem) => {
      if (mem) {
        io.to(mem);
      }
    });
    io.emit("group-edit", data);
  });
});

app.use("/api/users", usersRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/messages", messagesRoute);

// const path = require("path");
// __dirname = path.resolve();
// // render deployment
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
//   });
// }

server.listen(port, () => console.log(`Server running on port ${port}`));
