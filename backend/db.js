const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("smartqueue", "sq_user", "@Sinhb988", {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
