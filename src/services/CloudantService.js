/**
 * Note: This file only needs to be run once (when first setting up the server) in order to initialize the db
 */

require('dotenv').load();
const Cloudant = require('cloudant');
const username = process.env.cloudant_username || 'nodejs';
const password = process.env.cloudant_password;
const cloudant = Cloudant(
  {
    account: username,
    password: password,
  }
);
console.log('Successfully connected to Cloudant DB:', cloudant);

// Allows only your domain to have access to DB
cloudant.set_cors({enable_cors: true, allow_credentials: true, origins: ['DOMAINURL']}, function (err, data) {
  console.log(err, data);
});

cloudant.db.list(function (err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '));
});

// Resets db: Deletes if already exists
cloudant.db.destroy('translatehistory', function (err) {
  if (err) {
    console.log('Error: Did not create db "translatehistory":', err);
  } else {
    // Create a new 'translatehistory' database.
    cloudant.db.create('translatehistory', function (err) {
      if (err) {
        console.log('Error: Did not create db "translatehistory":', err);
      } else {
        console.log('Successfuly created db "translatehistory"');
      }
    });
  }
});
