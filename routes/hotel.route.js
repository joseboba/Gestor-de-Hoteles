"use strict";

var express = require("express");
var mdAuth = require("../middlerwars/authenticated");
var hotelController = require("../controllers/hotel.controller");

var api = express.Router();

api.post("/login", hotelController.login);
api.post("/saveHotel", hotelController.saveHotel);
api.delete(
  "/removeHotel/:idH",
  mdAuth.ensureAuthHotel,
  hotelController.removeHotel
);
api.put(
  "/updateHotel/:idH",
  mdAuth.ensureAuthHotel,
  hotelController.updateHotel
);

module.exports = api;
