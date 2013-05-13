Rocking Flannel Website with Voting App
=======================================

Website for the Bellingham 90's cover band [FLANNEL](http://www.rockingflannel.com/). The bulk of functional code exists in ./routes/index.js and ./views/vote.jade.

Core packages
-------------

* Express (3.1.0) - Web Framework
* Jade (0.28.2) - Templating Engine

Directions
----------

	* git clone https://github.com/ryananthony/rocking-flannel
	* npm install (may need to call sudo npm install)

UPDATE 5/12/13 - CouchDB scrapped in favor of using flat JSON files with the 'fs' module.