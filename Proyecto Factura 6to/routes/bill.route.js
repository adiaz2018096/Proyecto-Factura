'use strict'

var express = require('express');
var documentController = require('../controllers/document.controller');
var mdAuth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/saveDocument/:idU', mdAuth.ensureAuth, documentController.saveBill);
api.get('/listBills/:idU', mdAuth.ensureAuthAdmin, documentController.listBills);
api.get('/listProductsBills/:idU', mdAuth.ensureAuthAdmin, documentController.listProductsBills);
api.get('/productsAgoted/:idU', mdAuth.ensureAuthAdmin, documentController.productsAgoted);

module.exports = api;