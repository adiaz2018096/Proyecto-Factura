
'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = '123456789987654321';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        address: user.address,
        email: user.email,    
        role: user.role,   
        iat:  moment().unix(),
        exp: moment().add(15, "minutes").unix()
    }
    return jwt.encode(payload, key);
}