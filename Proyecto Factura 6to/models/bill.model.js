'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = Schema ({
    numberBill: Number,
    client: String,
    product: [{
        name: String,
        quantity: Number,
        price: Number,
        total: Number
    }],
    total: Number
});

module.exports = mongoose.model('bill', billSchema);