/**
 * A very simple account editor
 */
'use strict';
var Account = require('../models/accountModel');

module.exports = function (server) {

    /**
     * Retrieve a list of all account for editing.
     */
    server.get('/account', function (req, res) {

        Account.find(function (err, prods) {
            if (err) {
                console.log(err);
            }

            var model =
            {
                account: prods
            };
            console.dir(model);
            res.render('account', model);
        });

    });


        /**
     * Retrieve a list of all account for editing.
     */
    server.get('/account/:userId', function (req, res) {

        console.log("*********** ID to edit : " + req.params.userId);

        Account.findOne({_id: req.params.userId}, function (err, obj) {
            if (err) {
                console.log(err);
            }

            var model =
            {
                account: obj
            };
            console.log("****************");
            console.dir(model);
            res.render('editaccount', model);
        });

    });


    /**
     * Add a new account to the database.
     * **** PLEASE READ THE COMMENT BELOW! ****
     */
    server.post('/account', function (req, res) {
        var email = req.body.email && req.body.email.trim(),
            addressline1 = req.body.addressline1 && req.body.addressline1.trim(),
            addressline2 = req.body.addressline2 && req.body.addressline2.trim(),
            city = req.body.city && req.body.city.trim(),
            state = req.body.state && req.body.state.trim(),
            zipcode = req.body.zipcode && req.body.zipcode.trim();
            
/*
            console.log('****************************');
            console.log('addressline1 : ' + addressline1);
            console.log('addressline2 : ' + addressline2);
            console.log('city : ' + city);
            console.log('state : ' + state);
            console.log('zipcode : ' + zipcode);
            console.log('****************************');

*/   

        //***** PLEASE READ THIS COMMENT ******\\\
        /*
         Using floating point numbers to represent currency is a *BAD* idea \\

         You should be using arbitrary precision libraries like:
         https://github.com/justmoon/node-bignum instead.

         So why am I not using it here? At the time of this writing, bignum is tricky to install
         on Windows-based systems. I opted to make this example accessible to more people, instead
         of making it mathematically correct.

         I would strongly advise against using this code in accountion.
         You've been warned!
         */
        var age = parseFloat(req.body.age, 10);

        
        var newAccount = new Account({
            email: email,
            address: {
                addressline1: addressline1,
                addressline2: addressline2,
                city: city,
                state: state,
                zipcode: zipcode
            }, 
            age: age
        });

        
        /*
         The call back receives two more arguments -> account/s that is/are added to the database
         and number of rows that are affected because of save, which right now are ignored.
         We only check for errors.
         */
        newAccount.save(function (err) {
            if (err) {
                console.log('save error', err);
            }

            res.redirect('/account');
        });
    });

    /**
     * Delete a account.
     * @paaram: req.body.accountId Is the unique id of the account to remove.
     */
    server.delete('/account', function (req, res) {
        Account.remove({_id: req.body.accountId}, function (err) {
            if (err) {
                console.log('Remove error: ', err);
            }
            res.redirect('/account');
        });
    });


    /**
     * Edit an account.     
     */
    server.put('/account/:id', function (req, res) {
        console.log('PUT received. Ignoring.');

         var email = req.body.email && req.body.email.trim(),
            firstName = req.body.firstName && req.body.firstName.trim(),
            lastName = req.body.lastName && req.body.lastName.trim(),
            age = req.body.age && req.body.age.trim();


        console.log('save : ' + req.params.id);

        // http://docs.mongodb.org/manual/reference/method/db.collection.update/#update-parameter
        // update with $set will update the existing document.        

        Account.update({_id: req.params.id}, {
            $set: {
                name:{
                    first:firstName,
                    last:lastName
                },
                email:email,
                age:age
            }
        }, function (err) {
            if (err) {
                console.log('Remove error: ', err);
            }
            res.redirect('/account');
        });

    });

};