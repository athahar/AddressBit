'use strict';


var DestinationModel = require('../models/destination'),
    http = require('http'),
    https = require('https');


module.exports = function (app) {


    app.get('/destination', function (req, res) {


        var opts = {
            host: "api.pearson.com",
            path: '/v2/travel/topten?limit=10&offset=0',
            method: "GET"
        },
        request = http.request(opts, function(resp) {
            var data = "";
                resp.setEncoding('utf8');

            resp.on('data', function (chunk) {
                data += chunk;
            });

            resp.on('end', function () {
                //console.dir(data);
                var model = JSON.parse(data)
                console.dir(model);                
                res.render('destination',model);
            });
        });
    request.end();
        
    });

    app.get('/v2/travel/topten/:id', function (req, res) {

        var opts = {
            host: "api.pearson.com",
            path: req.url,
            method: "GET"
        },
        request = http.request(opts, function(resp) {
            var data = "";
                resp.setEncoding('utf8');

            resp.on('data', function (chunk) {
                data += chunk;
            });

            resp.on('end', function (err) {

                if(err){
                     console.log(error);
                     return;
                }
                //console.dir(data);
                try{
                     var model = JSON.parse(data);
                    // console.dir(model);                
                    res.render('destinationPath',model);
                }catch(err){
                    console.log(err);
                }
            });
        });
        request.end();
        
    });

};
