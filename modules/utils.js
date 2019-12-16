'use strict';
const utils = {};
const pg = require('pg');

utils.client = new pg.Client(process.env.DATABASE_URL);
utils.client.on('error', error => console.error(error));
utils.client.connect();

module.exports = utils;