"use strict";

var Hotel = require("../models/hotel.model");
var bcrypt = require("bcrypt-nodejs");
var jwtH = require("../services/jwtH");
var User = require("../models/user.model");

//LOGIN HOTEL
function login(req, res) {
  let params = req.body;

  if (params.user && params.password) {
    Hotel.findOne({ user: params.user }, (err, foundHotel) => {
      if (err) {
        res.status(500).send(err);
      } else if (foundHotel) {
        bcrypt.compare(
          params.password,
          foundHotel.password,
          (err, password) => {
            if (err) {
              res.status(500).send(password);
            } else if (password) {
              res.send({ token: jwtH.createToken(foundHotel) });
            } else {
              res.status(403).send({ message: "Contraseña incorrecta" });
            }
          }
        );
      } else {
      }
    });
  } else {
    res.send({ message: "Ingrese los datos necesarios" });
  }
}

//CREATE HOTEL
function saveHotel(req, res) {
  let params = req.body;
  let hotel = new Hotel();

  if (
    params.name &&
    params.direction &&
    params.phone &&
    params.priceNigth &&
    params.dates &&
    params.stars &&
    params.password
  ) {
    Hotel.findOne(
      { $or: [{ direction: params.direction }, { phone: params.phone }] },
      (err, foundHotel) => {
        if (err) {
          res.status(500).send(err);
        } else if (foundHotel) {
          res.status(406).send({ message: "Este hotel ya existe" });
        } else {
          hotel.name = params.name;
          hotel.phone = params.phone;
          hotel.direction = params.direction;
          hotel.dates = params.dates;
          hotel.priceNigth = params.priceNigth;
          hotel.stars = params.stars;
          hotel.user = hotel._id;
          bcrypt.hash(params.password, null, null, (err, password) => {
            if (err) {
              res.status(500).send(err);
            } else if (password) {
              hotel.password = password;
              hotel.save((err, hotelSaved) => {
                if (err) {
                  res.status(500).send(err);
                } else if (hotelSaved) {
                  res.send({
                    message: "Se ha guardado con exito el siguiente hotel",
                    hotelSaved,
                  });
                } else {
                  res
                    .status(418)
                    .send({ message: "No se ha podido guardar el hotel" });
                }
              });
            } else {
              res
                .status(418)
                .send({ message: "No se ha encriptado la contraseña" });
            }
          });
        }
      }
    );
  } else {
    res.status(404).send({ message: "Ingrese los campos necesarios" });
  }
}

//ELIMNAR HOTEL
function removeHotel(req, res) {
  let id = req.params.idH;

  if (id != req.hotel.sub) {
    req.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else {
    Hotel.findByIdAndRemove(id, (err, removedHotel) => {
      if (err) {
        res.status(500).send(err);
      } else if (removedHotel) {
        res.send({
          message: "Se ha eliminado con exito el siguiente hotel: ",
          removedHotel,
        });
      } else {
        res.status(418).send({ message: "Este hotel ya ha sido eliminado" });
      }
    });
  }
}

// ACTUALIZAR HOTEL
function updateHotel(req, res) {
  let id = req.params.idH;
  let update = req.body;

  if (id != req.hotel.sub) {
    res.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else {
    Hotel.findOne(
      { $or: [{ direction: update.direction }, { phone: update.phone }] },
      (err, foundHotel) => {
        if (err) {
          res.status(500).send(err);
        } else if (foundHotel) {
          res.send({
            message: "No se pueden ingresar datos de hoteles ya creados",
          });
        } else {
          if (update.user) {
            res
              .status(406)
              .send({ message: "Usted no puede cambiar el usuario" });
          } else if (update.password) {
            bcrypt.hash(update.password, null, null, (err, password) => {
              update.password = password;
              if (err) {
                res.status(500).send(err);
              } else if (password) {
                Hotel.findByIdAndUpdate(
                  id,
                  update,
                  { new: true },
                  (err, hotelUpdate) => {
                    if (err) {
                      res.status(500).send(err);
                    } else if (hotelUpdate) {
                      res.send({
                        message: "Se ha actualizado el siguiente hotel: ",
                        hotelUpdate,
                      });
                    } else {
                      res.status(418).send({
                        message: "No se ha podido actualizar el hotel",
                      });
                    }
                  }
                );
              } else {
                res
                  .status(418)
                  .send({ message: "No pudo encriptarse la contraseña" });
              }
            });
          } else {
            Hotel.findByIdAndUpdate(
              id,
              update,
              { new: true },
              (err, hotelUpdate) => {
                if (err) {
                  res.status(500).send(err);
                } else if (hotelUpdate) {
                  res.send({
                    message: "Se ha actualizado el siguiente hotel: ",
                    hotelUpdate,
                  });
                } else {
                  res
                    .status(418)
                    .send({ message: "No se ha podido actualizar el hotel" });
                }
              }
            );
          }
        }
      }
    );
  }
}

module.exports = {
  login,
  saveHotel,
  removeHotel,
  updateHotel,
};
