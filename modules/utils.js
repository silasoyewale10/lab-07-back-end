'use strict';
const utils = {};
const pg = require('pg');

utils.client = new pg.Client(process.env.DATABASE_URL);
utils.client.on('error', error => console.error(error));
utils.client.connect();


utils.handleError= function handleError(err, response) {
	// console.log(err);
	if (response) response.status(500).send('You are wrong. Merry Christmas');

}

module.exports = utils;
