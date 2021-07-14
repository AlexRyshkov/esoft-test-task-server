const db = require("../models");
const Op = db.Sequelize.Op;
const fn = db.Sequelize.fn;
const col = db.Sequelize.col;
const User = db.user;

exports.getAssigness = async (req, res) => {
  const userId = req.userId;
  const assignees = await User.findAll({
    where: {
      teamleadId: userId
    },
    attributes: ["id", "login", [fn('CONCAT', col('surname'), ' ', col('name'), ' ', col('middlename')), 'fullname']],
  });
  res.status(200).send(assignees);
};
