'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
// LOCATION DATA

function FormattedData(query, response) {
    this.search_query = query;
    this.formatted_query = response.body.results[0].formatted_address;
    this.latitude = response.body.results[0].geometry.location.lat;
    this.longitude = response.body.results[0].geometry.location.lng;
}


app.get('/location', handleLocationRequest)
function handleLocationRequest(request, response) {
    // const quer = request.query.data;
    superagent.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`
        ).then(result => {
    const place = new FormattedData (request.query.data, result);
    response.send(place)
})
.catch(err => handleError (err, response))
}

function FormattedTimeAndWeather(query, specificweather) {
    
    this.forecast = specificweather.summary
    this.time = new Date(specificweather.time * 1000).toDateString();
}

app.get('/weather', handleWeatherRequest)
function handleWeatherRequest(request, response) {
    var arrDaysWeather = [];
    let query = request.query.data;
    const weatherData = require('./data/darksky.json')
    console.log(weatherData.daily.data.length)

    // for (var x = 0; x < weatherData.daily.data.length; x++){
    //     console.log("weatherData.daily.data[x] is " + weatherData.daily.data[x])
    weatherData.daily.data.map(item => {
        var newWeather = new FormattedTimeAndWeather(query, item)
        arrDaysWeather.push(newWeather)
        return arrDaysWeather;
    })
    
    response.send(arrDaysWeather)
}

  function handleError(err, response) {
    console.log(err);
    if (response) response.status(500).send('You are wrong. Merry Christmas');
  }



console.log('LOCATIONS END FIRING');

app.listen(PORT, () => {
    console.log("Port is working and listening  onnnnn port " + PORT)
});