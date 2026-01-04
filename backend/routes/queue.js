const express = require("express");
const router = express.Router();
const Queue = require("../models/queue");
const Token = require("../models/token");

// Helper to calculate dynamic avg wait time based on crowd
function calculateAvgWait(crowd_level) {
  if (crowd_level === 1) return 2; // low
  if (crowd_level === 2) return 4; // medium
  if (crowd_level === 3) return 6; // high
  return 5; // default
}

// Get queue status
router.get("/status/:location", async (req, res) => {
  try {
    const { location } = req.params;
    const queue = await Queue.findOne({ where: { location } });
    if (!queue) return res.status(404).json({ error: "Queue not found" });

    const tokensInQueue = await Token.count({
      where: { location, status: "waiting" },
    });

    const avgWaitTime = calculateAvgWait(queue.crowd_level);

    res.json({
      location: queue.location,
      current_token: queue.current_token,
      last_token: queue.last_token,
      avg_wait_time: avgWaitTime,
      tokens_in_queue: tokensInQueue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch queue" });
  }
});

// Join queue (take token)
router.post("/join", async (req, res) => {
  try {
    const { location } = req.body;
    const queue = await Queue.findOne({ where: { location } });
    if (!queue) return res.status(404).json({ error: "Queue not found" });

    const newTokenNumber = queue.last_token + 1;
    await Token.create({ location, token_number: newTokenNumber });

    queue.last_token = newTokenNumber;
    await queue.save();

    const avgWaitTime = calculateAvgWait(queue.crowd_level);

    res.json({
      token: newTokenNumber,
      avg_wait_time: avgWaitTime,
      current_token: queue.current_token,
      tokens_in_queue: await Token.count({ where: { location, status: "waiting" } }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to take token" });
  }
});

// Call next token (admin)
router.post("/next", async (req, res) => {
  try {
    const { location } = req.body;
    const queue = await Queue.findOne({ where: { location } });
    if (!queue) return res.status(404).json({ error: "Queue not found" });

    queue.current_token += 1;
    await queue.save();

    const calledToken = queue.current_token;

    // Mark token as served
    await Token.update(
      { status: "served" },
      { where: { location, token_number: calledToken } }
    );

    const tokensInQueue = await Token.count({ where: { location, status: "waiting" } });
    const avgWaitTime = calculateAvgWait(queue.crowd_level);

    res.json({
      queue: {
        location: queue.location,
        current_token: queue.current_token,
        last_token: queue.last_token,
        avg_wait_time: avgWaitTime,
      },
      calledToken,
      tokens_in_queue: tokensInQueue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to call next token" });
  }
});

module.exports = router;

/*const express = require("express");
const router = express.Router();
const Queue = require("../models/queue");
const Token = require("../models/token");
const sequelize = require("../db");

async function getQueueSummary(queue) {
  const total = await Token.count({ where: { queueId: queue.id, served: false } });
  const lastTokenRow = await Token.findOne({
    where: { queueId: queue.id },
    order: [["token_no", "DESC"]]
  });
  const lastToken = lastTokenRow ? lastTokenRow.token_no : 0;
  return {
    id: queue.id,
    location: queue.location,
    current_token: queue.current_token,
    tokens_in_queue: total,
    last_token_no: lastToken
  };
}

router.post("/join", async (req, res) => {
  const { location } = req.body;
  const t = await sequelize.transaction();
  try {
    let queue = await Queue.findOne({ where: { location }, transaction: t });
    if (!queue) queue = await Queue.create({ location, current_token: 0 }, { transaction: t });

    const last = await Token.findOne({
      where: { queueId: queue.id },
      order: [["token_no", "DESC"]],
      transaction: t
    });
    const nextTokenNo = last ? last.token_no + 1 : 1;

    const token = await Token.create({ token_no: nextTokenNo, queueId: queue.id, served: false }, { transaction: t });
    await t.commit();

    const summary = await getQueueSummary(queue);
    res.json({ token: nextTokenNo, queue: summary });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.post("/next", async (req, res) => {
  const { location } = req.body;
  const t = await sequelize.transaction();
  try {
    const queue = await Queue.findOne({ where: { location }, transaction: t });
    if (!queue) { await t.rollback(); return res.status(404).json({ msg: "Queue not found" }); }

    const nextToken = await Token.findOne({
      where: { queueId: queue.id, served: false, token_no: { [sequelize.Sequelize.Op.gt]: queue.current_token } },
      order: [["token_no", "ASC"]],
      transaction: t
    });

    if (!nextToken) { await t.commit(); const summary = await getQueueSummary(queue); return res.json({ msg: "No tokens waiting", queue: summary }); }

    nextToken.served = true; await nextToken.save({ transaction: t });
    queue.current_token = nextToken.token_no; await queue.save({ transaction: t });
    await t.commit();

    const summary = await getQueueSummary(queue);
    res.json({ queue: summary, calledToken: nextToken.token_no });
  } catch (err) { await t.rollback(); res.status(500).json({ msg: "Server error", error: err.message }); }
});

router.get("/status/:location", async (req, res) => {
  const queue = await Queue.findOne({ where: { location: req.params.location } });
  if (!queue) return res.json({});
  const summary = await getQueueSummary(queue);
  res.json(summary);
});

module.exports = router;*/