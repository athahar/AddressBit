
var crypto 		= require('crypto'),
	moment 		= require('moment'),
	db = require('./lib/database');


var accounts = db.collection('accounts');

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(error, obj) {
		if (obj){
			obj.pass == pass ? callback(obj) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(error, obj) {
		if (obj == null){
			console.log('user-not-found : ' + user)
			callback('user-not-found');
		}	else{
			validatePassword(pass, obj.pass, function(error, res) {
				if (res){
					callback(null, obj);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({email:newData.email}, function(error, obj) {
		if (obj){
			callback('username-taken');
		}	else{
			accounts.findOne({email:newData.email}, function(e, obj) {
				if (obj){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insert(newData, {safe: true}, callback);
					});
				}
			});
		}
	});
}

exports.updateAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, obj){
		obj.name 		= newData.name;
		obj.email 	= newData.email;
		obj.country 	= newData.country;
		if (newData.pass == ''){
			accounts.save(obj, {safe: true}, function(error) {
				if (error) callback(error);
				else callback(null, obj);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				obj.pass = hash;
				accounts.save(obj, {safe: true}, function(error) {
					if (error) callback(error);
					else callback(null, obj);
				});
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({email:email}, function(error, obj){
		if (error){
			callback(error, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        obj.pass = hash;
		        accounts.save(obj, {safe: true}, callback);
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({email:email}, function(error, obj){ callback(obj); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({ $and: [{email:email, pass:passHash}] }, function(error, obj){
		callback(obj ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	accounts.find().toArray(
		function(error, res) {
		if (error) callback(error)
		else callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(error, res) {
		if (error) callback(error)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(error, results) {
		if (error) callback(error)
		else callback(null, results)
	});
}
