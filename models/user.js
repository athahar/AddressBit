/**
 * A model for our user
 */
'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    nconf = require('nconf');


var userModel = function () {

        var userSchema = mongoose.Schema({
            email: { type: String, unique: true },  //Ensure logins are unique.
            password: String,
            address:{
                addressline1: String,
                addressline2: String,
                city: String,
                state: String,
                zipcode: Number
            },
            name: String,            
            role: String
        });

        /**
         * Helper function that hooks into the 'save' method, and replaces plaintext passwords with a hashed version.
         */
        userSchema.pre('save', function (next) {
            var user = this;

            //If the password has not been modified in this save operation, leave it alone (So we don't double hash it)
            if (!user.isModified('password')) {
                next();
                return;
            }

            console.log("************ save: bcrypting");

            //Retrieve the desired difficulty from the configuration. (Default = 8)
            var DIFFICULTY = (nconf.get('bcrypt') && nconf.get('bcrypt').difficulty) || 8;

            //Encrypt it using bCrypt. Using the Sync method instead of Async to keep the code simple.
            var hashedPwd = bcrypt.hashSync(user.password, DIFFICULTY);

            //Replace the plaintext pw with the Hash+Salted pw;
            user.password = hashedPwd;

            console.log("************ save: bcrypted user.password : " + user.password);

            //Continue with the save operation
            next();
        });

        /**
         * Helper function that takes a plaintext password and compares it against the user's hashed password.
         * @param plainText
         * @returns true/false
         */
        userSchema.methods.passwordMatches = function (plainText) {
            var user = this;

            console.log("************ Login: comparing password: " );
            return bcrypt.compareSync(plainText, user.password);
        };


        return mongoose.model('User', userSchema);
    };

module.exports = new userModel();