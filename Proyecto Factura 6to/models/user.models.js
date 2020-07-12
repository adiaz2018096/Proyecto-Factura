'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema ({
    name: String,
    address: String,
    phone: Number,
    email:String,
    password: String,
    role: String
});

module.exports = mongoose.model('user', userSchema);