'use strict';

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlerwars/authenticated');

var api = express.Router();

api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.delete('/removeUser/:id', mdAuth.ensureAuth,userController.removeUser);
api.put('/updateUser/:id', mdAuth.ensureAuth,userController.updateUser);
api.post('/getHotels/:id', mdAuth.ensureAuth, userController.getHotels);
api.post('/range/:id', mdAuth.ensureAuth, userController.range);
api.post('/getStars/:id', mdAuth.ensureAuth, userController.getStars);
api.post('/getPrice/:id', mdAuth.ensureAuth, userController.getPrice);

module.exports = api;