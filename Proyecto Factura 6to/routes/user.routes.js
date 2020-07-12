'use strict'

var express = require('express')
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/saveUser', userController.saveUser);
api.post('/registerLogin', userController.registerLogin);
api.get('/findByName', userController.findByName);
api.get('/findByCategory', userController.findByCategory);
api.put('/editUsers/:idP/:idU', mdAuth.ensureAuth,userController.editUsers);
api.get('/listUsers', userController.listUsers);
api.delete('/deleteUsers/:idD/:idU', mdAuth.ensureAuth, userController.deleteUsers);

module.exports = api;