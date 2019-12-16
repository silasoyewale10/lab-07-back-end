'use strict';
const superagent = require('superagent');

const client = require('./utils.js').client;
const handleError = require('./utils.js').handleError;


function FormattedData(query, response) {
	this.search_query = query;
	this.formatted_query = response.body.results[0].formatted_address;
	this.latitude = response.body.results[0].geometry.location.lat;
	this.longitude = response.body.results[0].geometry.location.lng;
}

function handleLocationRequest(request, response) {
	//if i have it send it, if i don't, go get it from google. 
	client.query('SELECT * FROM locations WHERE search_query = $1', [request.query.data]).then(result => {
		//results correspond  to the data from sql.
		if (result.rowCount < 1) {
			superagent.get(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`
			).then(result => {
				const place = new FormattedData(request.query.data, result);
				const SQL = `INSERT INTO locations(
			   search_query,
			   formatted_query,
			   latitude, 
			   longitude
			 ) VALUES(
			   $1, 
			   $2,
			   $3,
			   $4
			 )`; // 1 refers to index 0

				client.query(SQL, [
					request.query.data,
					result.body.results[0].formatted_address,
					result.body.results[0].geometry.location.lat,
					result.body.results[0].geometry.location.lng,
				]);
				response.send(place)
			}).catch(err => handleError(err, response))
		}
		else {

			let cityMatched = result.rows[0]
			response.send(cityMatched);

		}


	})  //gets from the db and .then probes the new data
}
module.exports = handleLocationRequest;