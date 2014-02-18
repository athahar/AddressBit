'use strict';


var kraken = require('kraken-js'),
    db = require('./lib/database'),
    express = require('express'),
    passport = require('passport'),
    auth = require('./lib/auth'),    
    flash = require('connect-flash'),
    User = require('./models/user'),
    app = {};
    


app.configure = function configure(nconf, next) {

    // Fired when an app configures itself
    //Configure the database
    db.config(nconf.get('databaseConfig'));

    //Tell passport to use our newly created local strategy for authentication
    passport.use(auth.localStrategy());

    //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(null, user);
        });
    });    

    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {

    // Run before any routes have been added.
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(flash());
    server.use(auth.injectUser);

    // Fired before routing occurs
    server.use(express.methodOverride());
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
    kraken.create(app).listen(function (err) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;
