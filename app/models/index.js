const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.todo = require("../models/todo.model.js")(sequelize, Sequelize);

db.user.belongsTo(db.user, { foreignKey: { name: 'teamleadId' } });
db.todo.belongsTo(db.user, { as: 'Initiator', foreignKey: 'initiatorId' });
db.todo.belongsTo(db.user, { as: 'Assignee', foreignKey: 'assigneeId' });

db.ROLES = ["employee", "teamlead"];

module.exports = db;
