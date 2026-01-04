const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./db");
const Queue = require("./models/queue");
const Token = require("./models/token");
const queueRouter = require("./routes/queue");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/queue", queueRouter);
app.get("/", (req, res) => res.send("Smart Queue Backend running"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

async function broadcastQueueUpdate(location) {
  const queue = await Queue.findOne({ where: { location } });
  if (!queue) return;

  const tokensInQueue = await Token.count({
    where: { location, status: "waiting" },
  });

  io.emit("queueUpdate", {
    location: queue.location,
    current_token: queue.current_token,
    tokens_in_queue: tokensInQueue,
  });
}

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("joinRoom", (room) => socket.join(room));
  socket.on("requestQueueRefresh", (location) => broadcastQueueUpdate(location));
  socket.on("disconnect", () => console.log("Socket disconnected", socket.id));
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(5000, () => console.log("Backend running on 5000"));
    setInterval(async () => {
      const queues = await Queue.findAll();
      for (const q of queues) await broadcastQueueUpdate(q.location);
    }, 3000);
  } catch (err) {
    console.error("Startup error", err);
  }
}

start();
/*const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./db");
const Queue = require("./models/queue");
const Token = require("./models/token");
const queueRouter = require("./routes/queue");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/queue", queueRouter);
app.get("/", (req, res) => res.send("Smart Queue Backend running"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

async function broadcastQueueUpdate(location) {
  const queue = await Queue.findOne({ where: { location } });
  if (!queue) return;
  const tokensInQueue = await Token.count({ where: { queueId: queue.id, served: false } });
  const lastTokenRow = await Token.findOne({ where: { queueId: queue.id }, order: [["token_no", "DESC"]] });
  const lastToken = lastTokenRow ? lastTokenRow.token_no : 0;

  io.emit("queueUpdate", {
    location: queue.location,
    current_token: queue.current_token,
    tokens_in_queue: tokensInQueue,
    last_token_no: lastToken
  });
}

io.on("connection", socket => {
  console.log("Socket connected", socket.id);
  socket.on("joinRoom", room => socket.join(room));
  socket.on("requestQueueRefresh", location => broadcastQueueUpdate(location));
  socket.on("disconnect", () => console.log("Socket disconnected", socket.id));
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(5000, () => console.log("Backend running on 5000"));
    setInterval(async () => {
      const queues = await Queue.findAll();
      for (const q of queues) await broadcastQueueUpdate(q.location);
    }, 3000);
  } catch (err) { console.error("Startup error", err); }
}

start();*/