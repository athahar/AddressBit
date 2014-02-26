'use strict';

var PearsonApis = require("pearson-api-sdk");
var request = require ('request');

module.exports =  function () {

 	// Example request with no apikey (sandbox) and no proxy

    var travelApi = PearsonApis.travel();
    var topten = travelApi.topten;

    var requestUrl = topten.getSearchUrl(); // This sets up the parameters and search terms described 


    console.log('requestUrl: ' + requestUrl);    

	 request(requestUrl, function (error, response, model) {
          if (!error && response.statusCode == 200) {            
          //  console.log(model);
            return model
        } else {
            console.log(error);
            return;
          }
        });

};
