const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
};

isEmployee = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === "employee") {
      next();
      return;
    }
    else {
      res.status(403).send({
        message: "Require employee role"
      });
    }
  });
};

isTeamlead = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === "teamlead") {
      next();
      return;
    }
    else {
      res.status(403).send({
        message: "Require teamlead role"
      });
    }
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isEmployee: isEmployee,
  isTeamlead: isTeamlead,
};
module.exports = authJwt;
