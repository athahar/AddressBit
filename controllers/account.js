/**
 * A very simple account editor
 */
'use strict';
var User = require('../models/user'),
    auth = require('../lib/auth');

module.exports = function (server) {

    /**
     * Retrieve a list of all account for editing.
     */
    server.get('/accounts', auth.isAuthenticated(), function (req, res) {

       User.find(function (err, prods) {
            if (err) {
                console.log(err);
            }

            var model =
            {
                account: prods
            };
            console.dir(model);
            res.render('accounts', model);
        });

    });

    //  /**
    //  * Render Login page
    //  */
    // server.get('/login', function (req, res) {
        
    //     res.render('login', { title: 'Hello - Please Login To Your Account' });
        
    // });

    // /**
    //  * Delete a account.
    //  * @paaram: req.body.accountId Is the unique id of the account to remove.
    //  */
    // server.post('/login', function (req, res) {

    //     var email           = req.body.email && req.body.email.trim(),
    //         password        = req.body.password && req.body.password.trim();

    //    User.findOne({email:email}, function(error, obj) {
    //         if (obj == null){
    //             // console.log('email-not-found : ' + email)
    //             res.send('email-not-found');
    //         }   else{
    //             // console.log('email-found : ' + email)
    //             WFEncrypt.validatePassword(password, obj.password, function(err, result) {
    //                 if (result){ // successfully validated                        
    //                     res.redirect('/account/' + obj._id);
    //                 }   else{
    //                     //console.log('invalid-password : ' + email)
    //                     res.send('invalid-password');
    //                 }
    //             });
    //         }
    //     });

    // });

    // /**
    //  * Retrieve a list of all account for editing.
    //  */
    // server.get('/signup', function (req, res) {

    //     res.render('signup', { title: 'Whereify - Create an account' });

    // });


    // /**
    //  * Add a new account to the database.
    //  */
    // server.post('/signup', function (req, res) {
    //     var email           = req.body.email && req.body.email.trim(),
    //         password        = req.body.password && req.body.password.trim(),
    //         addressline1    = req.body.addressline1 && req.body.addressline1.trim(),
    //         addressline2    = req.body.addressline2 && req.body.addressline2.trim(),
    //         city            = req.body.city && req.body.city.trim(),
    //         state           = req.body.state && req.body.state.trim(),
    //         zipcode         = req.body.zipcode && req.body.zipcode.trim(),
    //         age             = req.body.age && req.body.age.trim() && parseFloat(req.body.age, 10);
            
        
    //         console.log('****************************');
    //         console.log('email : ' + email);
    //         console.log('password : ' + password);
    //         console.log('addressline1 : ' + addressline1);
    //         console.log('addressline2 : ' + addressline2);
    //         console.log('city : ' + city);
    //         console.log('state : ' + state);
    //         console.log('zipcode : ' + zipcode);
    //         console.log('****************************'); 
        
        
    //     var newAccount = new Account({
    //         email: email,
    //         password: password,
    //         address: {
    //             addressline1: addressline1,
    //             addressline2: addressline2,
    //             city: city,
    //             state: state,
    //             zipcode: zipcode
    //         }, 
    //         age: age
    //     });


    //    User.findOne({email:email}, function(error, obj) {
    //         if (obj){
    //             //console.log('email-taken');
    //             res.send("email-taken", 400);
    //         }   else{
    //             WFEncrypt.saltAndHash(newAccount.password, function(hash){
    //                 newAccount.password = hash;
    //                 newAccount.creationDate = moment().format('ll'); // append date stamp when record was created 
                    
    //                 newAccount.save(function (err,obj) {
    //                     if (err) {
    //                         console.log('save error', err);                            
    //                         res.send(err.message, 400);
    //                     }
 
    //                     res.redirect('/account/' + obj._id);
    //                 });

    //             });
    //         }
    //     });

    // });


    /**
     * Retrieve a list of all account for editing.
     */
    server.get('/account/:userId', auth.isAuthenticated(), function (req, res) {

       User.findOne({_id: req.params.userId}, function (err, obj) {
            if (err) {
                console.log(err);
            }

            var model =
            {
                account: obj
            };
            console.dir(model);
            res.render('editaccount', model);
        });

    });

    /**
     * Delete a account.
     * @paaram: req.body.accountId Is the unique id of the account to remove.
     */
    server.delete('/account', auth.isAuthenticated(), function (req, res) {
       User.remove({_id: req.body.accountId}, function (err) {
            if (err) {
                console.log('Remove error: ', err);
            }
            res.redirect('/accounts');
        });
    });


    /**
     * Edit an account.     
     */
    server.put('/account/:id', auth.isAuthenticated(), function (req, res) {
        console.log('PUT received..');
       
        var addressline1    = req.body.addressline1 && req.body.addressline1.trim(),
            addressline2    = req.body.addressline2 && req.body.addressline2.trim(),
            city            = req.body.city && req.body.city.trim(),
            state           = req.body.state && req.body.state.trim(),
            zipcode         = req.body.zipcode && req.body.zipcode.trim(),
            age             = req.body.age && req.body.age.trim() && parseFloat(req.body.age, 10);

            console.log('****************************');           
            
            console.log('addressline1 : ' + addressline1);
            console.log('addressline2 : ' + addressline2);
            console.log('city : ' + city);
            console.log('state : ' + state);
            console.log('zipcode : ' + zipcode);
            console.log('****************************'); 

            console.log('save : ' + req.params.id);

        // http://docs.mongodb.org/manual/reference/method/db.collection.update/#update-parameter
        // update with $set will update the existing document.        

           User.update(
                { _id: req.params.id},    
                { $set: {
                        address: {
                            addressline1: addressline1,
                            addressline2: addressline2,
                            city: city,
                            state: state,
                            zipcode: zipcode
                        }
                    }
                }, 
                { upsert: true },
                function (err) {
                    if (err) {
                        console.log('update error: ', err);
                    }else{
                        res.send('successfully updated ');    
                    }
                });
    });

};