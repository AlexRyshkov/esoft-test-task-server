module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    name: {
      type: Sequelize.STRING
    },
    middlename: {
      type: Sequelize.STRING
    },
    surname: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.ENUM('employee', 'teamlead')
    },
    login: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};
