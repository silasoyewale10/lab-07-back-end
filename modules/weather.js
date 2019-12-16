'use strict';
const superagent = require('superagent');

const client = require('./utils.js').client;

const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;

function getWeather(req, res) {
	const weatherLatitude = req.query.data.latitude;
	const weatherLongitude = req.query.data.longitude
	// console.log('req.query', req.query); // Gives the info for ex. Lynnwood, description, lat and lng

	superagent.get(`https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${weatherLatitude},${weatherLongitude}`).then(response => {
		// console.log('response.body.daily.data', response.body.daily.data) // Gives me the object or array data requested 

		const allWeather = response.body.daily.data;

		let allData = allWeather.map(event => {
			return {
				'time': new Date(event.time * 1000).toDateString(),
				'forecast': event.summary
			}
		});
		// console.log('allData', allData);
		res.send(allData);
	}) .catch(err => handleError(err, response))
}

module.exports = getWeather;