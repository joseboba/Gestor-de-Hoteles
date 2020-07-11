'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    user: String,
    password: String,
    phone: String,
    direction: String,
    priceNigth: String,
    dates: Date,
    stars: String,
});

module.exports = mongoose.model('hotel', hotelSchema);