'use strict';

var SignupModel = require('../models/signup'),
    User = require('../models/user');



module.exports = function (app) {

    var model = new SignupModel();


    /**
     * Retrieve a list of all account for editing.
     */
    app.get('/signup', function (req, res) {

        res.render('signup', model );

    });


    /**
     * Add a new account to the database.
     */
    app.post('/signup', function (req, res) {
        var email           = req.body.email && req.body.email.trim(),
            password        = req.body.password && req.body.password.trim(),
            addressline1    = req.body.addressline1 && req.body.addressline1.trim(),
            addressline2    = req.body.addressline2 && req.body.addressline2.trim(),
            city            = req.body.city && req.body.city.trim(),
            state           = req.body.state && req.body.state.trim(),
            zipcode         = req.body.zipcode && req.body.zipcode.trim(),
            age             = req.body.age && req.body.age.trim() && parseFloat(req.body.age, 10);
            
        
            console.log('****************************');
            console.log('email : ' + email);
            console.log('password : ' + password);
            console.log('addressline1 : ' + addressline1);
            console.log('addressline2 : ' + addressline2);
            console.log('city : ' + city);
            console.log('state : ' + state);
            console.log('zipcode : ' + zipcode);
            console.log('****************************'); 
        
        
        var newAccount = new User({
            email: email,
            password: password,
            address: {
                addressline1: addressline1,
                addressline2: addressline2,
                city: city,
                state: state,
                zipcode: zipcode
            }, 
            age: age,
            role: 'user'
        });


        User.findOne({email:email}, function(error, obj) {
            if (obj){
                //console.log('email-taken');
                res.send("email-taken", 400);

            } else {
                console.log('*** saving now *** '); 
               // newAccount.creationDate = moment().format('ll'); // append date stamp when record was created 
                newAccount.save(function (err,obj) {
                    if (err) {
                        console.log('save error', err);                            
                        res.send(err.message, 400);
                    }

                    res.redirect('/account/' + obj._id);
                });
            }
        });

    });



};
