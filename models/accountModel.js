'use strict';

var mongoose = require('mongoose');

var accountModel = function () {

    //Define a super simple schema for our accounts.
    var accountSchema = mongoose.Schema({
        email: String,
        password: String,
        address:{
            addressline1: String,
            addressline2: String,
            city: String,
            state: String,
            zipcode: Number
        },
        age: Number,
        gender: String,
        creationDate: {type: Date}

    });
    

    return mongoose.model('Account', accountSchema);

};

module.exports = new accountModel();