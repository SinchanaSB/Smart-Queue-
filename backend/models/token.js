const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Token = sequelize.define(
  "Token",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    location: { type: DataTypes.STRING },
    token_number: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM("waiting", "served"), defaultValue: "waiting" },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false, tableName: "tokens" }
);

module.exports = Token;
/*const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Queue = require("./queue");

const Token = sequelize.define("Token", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  token_no: { type: DataTypes.INTEGER, allowNull: false },
  served: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: "tokens" });

Token.belongsTo(Queue, { foreignKey: "queueId" });
Queue.hasMany(Token, { foreignKey: "queueId" });

module.exports = Token;*/