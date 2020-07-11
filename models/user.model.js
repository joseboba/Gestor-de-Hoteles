'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    password: String,
    mail: String,
    phone:  String,
    role: String
});

module.exports = mongoose.model('user', userSchema);