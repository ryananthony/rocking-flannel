Rocking Flannel Website with Voting App
=======================================

Website for the Bellingham 90's cover band [FLANNEL](http://www.rockingflannel.com/). The bulk of functional code exists in ./routes/index.js and ./views/vote.jade.

Core packages
-------------

* Express (3.1.0) - Web Framework
* Jade (0.28.2) - Templating Engine
* Cradle (0.6.4) - Couchdb Integration

Directions
----------

	* git clone https://github.com/ryananthony/rocking-flannel
	* npm install

Finally, you will need to edit file ./local_modules/db/db-rename-me-to_db.js to contain credentials to your own CouchDB Server and then rename this file to filename db.js.
