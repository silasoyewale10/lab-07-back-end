'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
// LOCATION DATA

function FormattedData(query, location) {
    this.search_query = query;
    this.formatted_query = location.formatted_address;
    this.latitude = location.geometry.location.lat;
    this.longitude = location.geometry.location.lng;
}


app.get('/location', handleLocationRequest)

function handleLocationRequest(request, response) {

    let query = request.query.data;

    const interestedData = require('./data/geo.json')
console.log(interestedData.results[0])
    let newLocation = new FormattedData(query, interestedData.results[0]) 

    response.send(newLocation)
}


function FormattedTimeAndWeather(query, specificweather) {
    
    this.forecast = specificweather.summary
    this.time = new Date(specificweather.time * 1000).toDateString();
}


app.get('/weather', handleWeatherRequest)

// function handleWeatherRequest(request, response) {
//     var arrDaysWeather = [];
//     let query = request.query.data;
//     const weatherData = require('./data/darksky.json')
//     // console.log(weatherData.daily.data.length)

//     for (var x = 0; x < weatherData.daily.data.length; x++){
//         console.log("weatherData.daily.data[x] is " + weatherData.daily.data[x])
//         var newWeather = new FormattedTimeAndWeather(query, weatherData.daily.data[x])
//         arrDaysWeather.push(newWeather)
//     }
//     response.send(arrDaysWeather)
// }

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












app.get('/*', function(request, response){
    response.status(404).send('Error Loading Results')
  })

console.log('LOCATIONS END FIRING');

app.listen(PORT, () => {
    console.log("Port is working and listening  onnnnn port " + PORT)
});