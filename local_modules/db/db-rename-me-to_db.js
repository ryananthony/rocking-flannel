var cradle = require('cradle');
var db = new(cradle.Connection)(/*couchdb host URL (as String)*/, /* port (as INT) */, {
  auth: { username: /*couchdb user (as String)*/, password: /*couchdb password (as String)*/ }
}).database(/*database name (as String)*/);

module.exports = db;