'use strict'

var express = require('express');
var productsController = require('../controllers/products.controller');
var mdAuth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/saveProducts/:id', mdAuth.ensureAuthAdmin, productsController.saveProducts);
api.get('/listProducts/:id', mdAuth.ensureAuthAdmin, productsController.listProducts);
api.put('/editProducts/:idP/:idU', mdAuth.ensureAuthAdmin, productsController.editProduct);
api.delete('/deleteProducts/:idP/:idU', mdAuth.ensureAuthAdmin, productsController.deleteProducts);
api.get('/findByName/:idU', mdAuth.ensureAuthAdmin, productsController.findByName);
api.put('/editStock/:idP/:idU', mdAuth.ensureAuthAdmin, productsController.editStock);
module.exports = api;