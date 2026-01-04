const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Queue = sequelize.define(
  "Queue",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    location: { type: DataTypes.STRING, unique: true },
    current_token: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_token: { type: DataTypes.INTEGER, defaultValue: 0 },
    avg_wait_time: { type: DataTypes.INTEGER, defaultValue: 5 },
    crowd_level: { type: DataTypes.INTEGER, defaultValue: 1 },
    last_updated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false, tableName: "queues" }
);

module.exports = Queue;
/*const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Queue = sequelize.define("Queue", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  location: { type: DataTypes.STRING, unique: true, allowNull: false },
  current_token: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: "queues" });

module.exports = Queue;*/