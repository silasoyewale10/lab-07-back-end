'use strict';
const superagent = require('superagent');

const client = require('./utils.js').client;

function getYelp(req, res){
	// https://api.yelp.com/v3/events?location=seattle

	const url = `https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${req.query.data.latitude}&longitude=${req.query.data.longitude}`
	superagent.get(url).set('Authorization', `Bearer ${process.env.YELP_API_KEY}`).then (data => {
		// console.log('My data.body is ',data.body.businesses)  //i have my array that i can call a map on
		// const allBusinessesFromSuperagent = JSON.parse(data.body.buinesses)
		console.log('allBusinessesFromSuperagent url isisisisi',data.body.businesses[0].price)
		const arrayOfBusinessesToFrontEnd = data.body.businesses.map((eachBusiness) => {
			return {
				'name':eachBusiness.name,
				'image_url':eachBusiness.image_url,
				'price':eachBusiness.price,
				'rating':eachBusiness.rating,
				'url':eachBusiness.url
			}
		})
		res.send(arrayOfBusinessesToFrontEnd)
		// var x =9;

		
	}).catch(err => handleError(err, response))


}

module.exports = getYelp;