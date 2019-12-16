'use strict';
const superagent = require('superagent');

const client = require('./utils.js').client;
const handleError = require('./utils.js').handleError;


function getEvents(req, res) {
	// console.log(req.query);
	// go to eventful, get data and get it to look like this
	superagent.get(`http://api.eventful.com/json/events/search?app_key=kcbDf9m2gZnd2bBR&keywords=&location=${req.query.data.formatted_query}&date=Future`).then(response => {
		//   console.log(JSON.parse(response.text).events.event[0]);
		const firstEvent = JSON.parse(response.text).events.event[0];
		const allEvents = JSON.parse(response.text).events.event;

		const allData = allEvents.map(event => {
			return {
				'link': event.url,
				'name': event.title,
				'event_date': event.start_time,
				'summary': event.description
			};
		});
		// console.log(allData);

		res.send(allData);

	}).catch(err => handleError(err, response))

}

module.exports = getEvents;