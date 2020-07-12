'use strict'

var express = require('express')
var categoryController = require('../controllers/category.controllers');
var mdAuth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/saveCategory/:id', mdAuth.ensureAuthAdmin, categoryController.saveCategory);
api.get('/listCategory', categoryController.listCategories);
api.put('/editCategory/:idC/:idU', mdAuth.ensureAuthAdmin, categoryController.editCategory);
api.delete('/deleteCategory/:idC/:idU', mdAuth.ensureAuthAdmin, categoryController.deleteCategory);

module.exports = api;