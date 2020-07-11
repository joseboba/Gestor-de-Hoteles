"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var key = "4729";

exports.createToken = (hotel) => {
  var payload = {
    sub: hotel._id,
    name: hotel.name,
    phone: hotel.phone,
    direction: hotel.direction,
    priceNigth: hotel.priceNigth,
    dates: hotel.dates,
    stars: hotel.stars,
    iat: moment().unix(),
    exp: moment().add(1, "day").unix(),
  };
  return jwt.encode(payload, key);
};
