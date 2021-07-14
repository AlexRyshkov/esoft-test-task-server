const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.signin = (req, res) => {
  User.findOne({
    where: {
      login: req.body.login
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "пользователя с таким логином не существует" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "пользователь ввел неверный пароль"
        });
      }

      var token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
        expiresIn: 86400
      });

      res.status(200).send({
        id: user.id,
        login: user.login,
        role: user.role,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
