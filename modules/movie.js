'use strict';
const superagent = require('superagent');

const client = require('./utils.js').client;

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
			// console.log('movie is ', movie)
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
		res.send(arrayOfProcessedMovieObjects)
	}).catch(err => handleError(err, response))
}

module.exports = getMovie;