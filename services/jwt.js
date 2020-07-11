'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var key = '0207';
exports.createToken = (user) =>{
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        mail: user.mail,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(1, "hour").unix()
    }
    return jwt.encode(payload, key);
}