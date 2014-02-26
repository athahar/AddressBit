'use strict';


var DestinationModel = require('../models/destination');


module.exports = function (app) {

    var model = new DestinationModel();


    app.get('/destination', function (req, res) {
        
        res.format({
            json: function () {
                res.json(model);
            },
            html: function () {
                res.render('destination', model);
            }
        });
    });

};
