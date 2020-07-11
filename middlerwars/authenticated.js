"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var key = "0207";

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "Peticion sin autenticación" });
  } else {
    var token = req.headers.authorization.replace(/['"]+/g, "");
    try {
      var payload = jwt.decode(token, key);
      if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: "Token expirado" });
      }
    } catch (ex) {
      return res.status(404).send({ message: "Token Invalido", ex });
    }

    req.user = payload;
    next();
  }
};

exports.ensureAuthAdmin = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "Petición sin autenticación" });
  } else {
    var token = req.headers.authorization.replace(/['"]+/g, "");
    try {
      var payload = jwt.decode(token, key);
      if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: "Token expirado" });
      } else if (payload.role != "ADMIN") {
        return res
          .status(401)
          .send({ message: "No tienes permiso para esta ruta" });
      }
    } catch (ex) {
      return res.status(404).send({ message: "Token invalido", ex });
    }
    req.user = payload;
    next();
  }
};

exports.ensureAuthHotel = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "Petición sin autenticación" });
  } else {
    var token = req.headers.authorization.replace(/['"]+/g, "");
    try {
      var payload = jwt.decode(token, "4729");
      if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: "Token expirado" });
      }
    } catch (ex) {
      return res.status(404).send({ message: "Token invalido", ex });
    }

    req.hotel = payload;
    next();
  }
};
