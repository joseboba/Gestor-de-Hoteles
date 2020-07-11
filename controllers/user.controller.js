"use strict";

var User = require("../models/user.model");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
var Hotel = require("../models/hotel.model");

//LOGIN
function login(req, res) {
  let params = req.body;

  if ((params.mail || params.username) && params.password) {
    User.findOne(
      { $or: [{ username: params.username }, { mail: params.mail }] },
      (err, foundUser) => {
        if (err) {
          res.status(500).send(err);
        } else if (foundUser) {
          bcrypt.compare(
            params.password,
            foundUser.password,
            (err, password) => {
              if (err) {
                res.status(500).send(err);
              } else if (password) {
                res.send({ token: jwt.createToken(foundUser) });
              } else {
                res.send({ message: "Contraseña incorrecta" });
              }
            }
          );
        } else {
          res
            .status(404)
            .send({ message: "Usuario o contraseña incorrectos", foundUser });
        }
      }
    );
  } else {
    res.status(404).send({ message: "Ingrese un correo o contraseña" });
  }
}

//SAVE
function saveUser(req, res) {
  let params = req.body;
  let user = new User();
  if (params.name && params.username && params.mail && params.password) {
    User.findOne(
      { $or: [{ username: params.username }, { mail: params.mail }] },
      (err, foundUser) => {
        if (err) {
          res.status(500).send(err);
        } else if (foundUser) {
          res.send({ message: "Este usuario ya existe" });
        } else {
          user.name = params.name;
          user.lastname = params.lastname;
          user.username = params.username;
          user.mail = params.mail;
          if (params.code == 5860) {
            user.role = "ADMIN";
            bcrypt.hash(params.password, null, null, (err, password) => {
              if (err) {
                res.status(500).send(err);
              } else if (password) {
                user.password = password;
                user.save((err, userSaved) => {
                  if (err) {
                    res.status(500).send(err);
                  } else if (userSaved) {
                    res.send({
                      message:
                        "El siguiente usuario se ha guardado correctamente",
                      userSaved,
                    });
                  } else {
                    res
                      .status(418)
                      .send({ message: "No se ha podido guardar el usuario" });
                  }
                });
              } else {
                res.status({ message: "No se pudo guardar el usuario" });
              }
            });
          } else {
            user.role = "USER";
            bcrypt.hash(params.password, null, null, (err, password) => {
              if (err) {
                res.status(500).send(err);
              } else if (password) {
                user.password = password;
                user.save((err, userSaved) => {
                  if (err) {
                    res.status(500).send(err);
                  } else if (userSaved) {
                    res.send({
                      message:
                        "El siguiente usuario se ha guardado correctamente",
                      userSaved,
                    });
                  } else {
                    res
                      .status(418)
                      .send({ message: "No se ha podido guardar el usuario" });
                  }
                });
              } else {
                res.status({ message: "No se pudo guardar el usuario" });
              }
            });
          }
        }
      }
    );
  } else {
    res.status(404).send({ message: "Ingrese los datos necesarios" });
  }
}

//REMOVE
function removeUser(req, res) {
  let id = req.params.id;

  if (id != req.user.sub) {
    res.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else {
    User.findByIdAndRemove(id, (err, userDeleted) => {
      if (err) {
        res.status(500).send(err);
      } else if (userDeleted) {
        res.send({ message: "El usuario eliminado fue", userDeleted });
      } else {
        res.status(404).send({ message: "Ese usuario ya fue eliminado" });
      }
    });
  }
}
//EDIT
function updateUser(req, res) {
  let params = req.body;
  let id = req.params.id;

  if (id != req.user.sub) {
    res.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else {
    User.findOne(
      { $or: [{ username: params.username }, { mail: params.mail }] },
      (err, foundUser) => {
        if (err) {
          res.status(500).send(err);
        } else if (foundUser) {
          res.status(406).send({
            message: "No se puede asignar usuarios o correos que ya existen",
          });
        } else {
          if (params.password) {
            bcrypt.hash(params.password, null, null, (err, password) => {
              if (err) {
                res.status(500).send(password);
              } else if (password) {
                params.password = password;
                User.findByIdAndUpdate(
                  id,
                  params,
                  { new: true },
                  (err, updated) => {
                    if (err) {
                      res.status(500).send(err);
                    } else if (updated) {
                      res.send({
                        message:
                          "Se ha actualizado con éxtio el siguiente usuario: ",
                        updated,
                      });
                    } else {
                      res
                        .status(418)
                        .send({ message: "No se pudo actualizar el usuario" });
                    }
                  }
                );
              } else {
                res
                  .status(418)
                  .send({ message: "No se pudo encriptar la contraseña" });
              }
            });
          } else {
            User.findByIdAndUpdate(
              id,
              params,
              { new: true },
              (err, updated) => {
                if (err) {
                  res.status(500).send(err);
                } else if (updated) {
                  res.send({
                    message:
                      "Se ha actualizado con éxtio el siguiente usuario: ",
                    updated,
                  });
                } else {
                  res
                    .status(418)
                    .send({ message: "No se pudo actualizar el usuario" });
                }
              }
            );
          }
        }
      }
    );
  }
}

function getHotels(req, res) {
  let id = req.params.id;
  let params = req.body;
  if (id != req.user.sub) {
    res.status(403).send({ message: "No tiene permitdo acceder a esta ruta" });
  } else {
    if (params.desc || params.asc) {
      if (params.asc) {
        Hotel.find({}, null, { sort: { name: 1 } }, (err, find) => {
          if (err) {
            res.status(500).send(err);
          } else if (find) {
            res.send(find);
          } else {
            res.status(404).send({ message: "No hay registros" });
          }
        });
      } else if (params.desc) {
        Hotel.find({}, null, { sort: { name: -1 } }, (err, find) => {
          if (err) {
            res.status(500).send(err);
          } else if (find) {
            res.send(find);
          } else {
            res.status(404).send({ message: "No hay registros" });
          }
        });
      }
    } else {
      res.status(406).send({ message: "Ingrese su criterio de busqueda" });
    }
  }
}

function range(req, res) {
  let params = req.body;
  let id = req.params.id;

  if (id != req.user.sub) {
    res.status(403).send({ message: "No tiene acceso a esta ruta" });
  } else {
    if (params.dates) {
      Hotel.find(
        { dates: { $lte: new Date(params.dates) } },
        null,
        { sort: { dates: -1 } },
        (err, found) => {
          if (err) {
            res.status(500).send(err);
          } else if (found) {
            res.send(found);
          } else {
            res.status(404).send({ message: "No existen registros" });
          }
        }
      );
    } else {
      res.status(406).send({ message: "Ingrese su criterio de busqueda" });
    }
  }
}

function getStars(req, res) {
  let params = req.body;
  let id = req.params.id;

  if (id != req.user.sub) {
    res.status(500).send({ message: "No tiene acceso a esta ruta" });
  } else {
    if (params.desc || params.asc) {
      if (params.asc) {
        Hotel.find({}, null, { sort: { stars: 1 } }, (err, find) => {
          if (err) {
            res.status(500).send(err);
          } else if (find) {
            res.send(find);
          } else {
            res.status(404).send({ message: "No hay registros" });
          }
        });
      } else if (params.desc) {
        Hotel.find({}, null, { sort: { stars: -1 } }, (err, find) => {
          if (err) {
            res.status(500).send(err);
          } else if (find) {
            res.send(find);
          } else {
            res.status(404).send({ message: "No hay registros" });
          }
        });
      }
    } else {
      res.status(406).send({ message: "Ingrese su criterio de busqueda" });
    }
  }
}

function getPrice(req, res) {
  let params = req.body;
  let id = req.params.id;

  if (id != req.user.sub) {
    res.status(500).send({ message: "No tiene acceso a esta ruta" });
  } else {
    if (params.desc || params.asc) {
      if (params.asc) {
        Hotel.find({}, null, { sort: { priceNigth: 1 } }, (err, find) => {
          if (err) {
            res.status(500).send(err);
          } else if (find) {
            res.send(find);
          } else {
            res.status(404).send({ message: "No hay registros" });
          }
        });
      } else if (params.desc) {
        Hotel.find({}, null, { sort: { priceNigth: -1 } }, (err, find) => {
          if (err) {
            res.status(500).send(err);
          } else if (find) {
            res.send(find);
          } else {
            res.status(404).send({ message: "No hay registros" });
          }
        });
      }
    } else {
      res.status(406).send({ message: "Ingrese su criterio de busqueda" });
    }
  }
}

function moreBougth(req, res) {
  Product.find({}, null, { sort: { stars: -1 } }, (err, find) => {
    if (err) {
      res.status(500).send(err);
    } else if (find) {
      res.send({ message: "Estos son los productos más comprados" });
    } else {
      res.status(404).send({ message: "Aún no hay registros" });
    }
  });
}

function exhausted(req, res) {
  Product.find({ stock: 0 }, (err, find) => {
    if (err) {
      res.status(500).send(err);
    } else if (find) {
      res.send({ message: "Estos son los productos que estan agotados", find });
    } else {
      res.status(404).send({ message: "No hay registros" });
    }
  });
}

module.exports = {
  login,
  saveUser,
  removeUser,
  updateUser,
  getHotels,
  range,
  getStars,
  getPrice,
  moreBougth,
  exhausted,
};
