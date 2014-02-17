'use strict';

/* private encryption & validation methods */
var crypto 		= require('crypto');

var WFEncrypt = function() {

	var generateSalt = function ()
	{
		var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
		var salt = '';
		for (var i = 0; i < 10; i++) {
			var p = Math.floor(Math.random() * set.length);
			salt += set[p];
		}
		return salt;
	};

	var md5 = function (str) {
		return crypto.createHash('md5').update(str).digest('hex');
	};

	return {
		saltAndHash : function(pass, callback){
			console.log("SALT N HASH : " + pass)
			var salt = generateSalt();
			callback(salt + md5(pass + salt));
		},
		validatePassword: function(plainPass, hashedPass, callback){
			var salt = hashedPass.substr(0, 10);
			var validHash = salt + md5(plainPass + salt);
			callback(null, hashedPass === validHash);
		}
	}	

};

module.exports = WFEncrypt();
