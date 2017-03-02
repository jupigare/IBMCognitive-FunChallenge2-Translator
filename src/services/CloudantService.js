//Note: This file only needs to be run once (when first setting up the server) in order to create the db

require('dotenv').load();
var Cloudant = require('cloudant');

// Initialize Cloudant with settings from .env 
var username = process.env.cloudant_username || "nodejs";
var password = process.env.cloudant_password;
var cloudant = Cloudant({account:username, password:password});

console.log('Successfully connected to Cloudant DB:', cloudant);
// cloudant.db.list(function(err, allDbs) {
// 	console.log('All my databases: %s', allDbs.join(', '));
// });

// Delete database if already exists
cloudant.db.destroy('translateHistory', function(err) {
 
	// Create a new "translateHistory" database. 
	cloudant.db.create('translateHistory', function() {
		console.log("Successfuly created db 'translateHistory'")
		// Specify the database we are going to use (translateHistory)... 
		var translateHistory = cloudant.db.use('translateHistory');
	});
});