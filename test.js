'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');

require('dotenv').config();
const superagent = require('superagent');
const app = express();
app.use(cors());


const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));
client.connect();

const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;

const PORT = process.env.PORT || 3000;
// LOCATION DATA

function FormattedData(query, response) {
	this.search_query = query;
	this.formatted_query = response.body.results[0].formatted_address;
	this.latitude = response.body.results[0].geometry.location.lat;
	this.longitude = response.body.results[0].geometry.location.lng;
}

app.get('/weather', getWeather);
app.get('/events', getEvents);
app.get('/movies', getMovie);
app.get('/location', handleLocationRequest)
app.get('/yelp', getWeather);

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
	});
}




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

	});

}


// `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${getCityName}&page=1&include_adult=false`;

//https://api.themoviedb.org/3/search/movie?api_key=ebad0ee2cbcbd884457e20f7cd06edc6&language=en-US&query=salem&page=1&include_adult=false
//ebad0ee2cbcbd884457e20f7cd06edc6
function getMovie(req, res) {
	const getCityName = req.query.data.formatted_query.split(',')[0];

	// console.log(getCityName)
	// const getCityName = req.query.data;
	
	superagent.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${getCityName}&page=1&include_adult=false`).then(data => {
        //  ${getCityName}
		// result.
		const allMovieFromSuperagent = JSON.parse(data.text)
		// console.log(allMovie)
		
		// console.log('********************result for getmovie data is', allMovie);
		const arrayOfProcessedMovieObjects = allMovieFromSuperagent.results.map( (movie) => {
			console.log('movie is ', movie)
			return {
				'title' : movie.title,
				 'overview' : movie.overview,
				 'average_votes' : movie.vote_average,
				 'total_votes' : movie.vote_count,
				 'image_url'  : `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
				 'popularity' : movie.popularity,
				 'released_on' : movie.release_date
			};

		});




		// console.log(arrayOfProcessedMovieObjects);

		res.send(arrayOfProcessedMovieObjects)

	})
	// return 
}

// function yelp(req, res)




























function handleError(err, response) {
			// console.log(err);
			if (response) response.status(500).send('You are wrong. Merry Christmas');

		}

// console.log('LOCATIONS END FIRING');

	app.listen(PORT, () => {
		console.log("Port is working and listening  onnnnn port " + PORT)
	});

