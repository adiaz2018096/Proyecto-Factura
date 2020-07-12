'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var categorySchema = Schema ({
    nameCategory: String
});

module.exports = mongoose.model('category', categorySchema);