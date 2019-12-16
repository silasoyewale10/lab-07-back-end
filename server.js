'use strict';

const express = require('express');
const cors = require('cors');

require('dotenv').config();
const superagent = require('superagent');
const app = express();
app.use(cors());





const PORT = process.env.PORT || 3000;
// LOCATION DATA


const handleLocationRequest = require('./modules/location');
const getWeather = require('./modules/weather')
const getEvents = require('./modules/event')
const getMovie = require('./modules/movie')
const getYelp = require('./modules/yelp')
app.get('/weather', getWeather);
app.get('/events', getEvents);
app.get('/movies', getMovie);
app.get('/location', handleLocationRequest)
// app.get('/yelp', getWeather);


app.get('/', (req, res) => {

	//check the database
	const SQL = 'SELECT * FROM locations;';
	client.query(SQL).then(sqlResponse => {
		// console.log(sqlResponse);
		res.send(sqlResponse.rows);
		var currentCity = 'SELECT * FROM locations WHERE location = $1';
	});
})

// function checkDB (){
//   var rowCounter = 0
// }
// checkDB();












// `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${getCityName}&page=1&include_adult=false`;

//https://api.themoviedb.org/3/search/movie?api_key=ebad0ee2cbcbd884457e20f7cd06edc6&language=en-US&query=salem&page=1&include_adult=false
//ebad0ee2cbcbd884457e20f7cd06edc6

app.get('/yelp', getYelp);


function handleError(err, response) {
			// console.log(err);
			if (response) response.status(500).send('You are wrong. Merry Christmas');

		}

// console.log('LOCATIONS END FIRING');

	app.listen(PORT, () => {
		console.log("Port is working and listening  onnnnn port " + PORT)
	});

