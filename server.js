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
    console.log('request.query.data is ' )
    
    response.send(place)
})
.catch(err => handleError (err, response))
}

function FormattedTimeAndWeather(query, resultBody) {
    
    this.forecast = resultBody.daily.data[0].summary
    this.time = new Date(resultBody.daily.data[0].time * 1000).toDateString();
}

app.get('/weather', handleWeatherRequest)
function handleWeatherRequest(request, response) {
    // console.log(request.query.data)
    
    superagent.get(
        `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`
        ).then(result => {
            let time = result.body.daily.data[0].time;
            let forcast = result.body.daily.data[0].summary

            console.log('forcast is  ', forcast)

            const weather = new FormattedTimeAndWeather(result.body)
            
            
            console.log('weather is ', weather)


            // console.log('WEATHER', weather)
            // console.log(request.query)
            // result.body.daily.data.map(forecast => request.query.data.push( new FormattedTimeAndWeather(request.query.data)));
            response.send(weather)
        })
}


// app.get('/event', handleEventRequest)
// function handleEventRequest(request, response, query) {
   
//     superagent.get(
//         `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${query.event},${query.event}`
//         ).then(result => {

//             let silasEvent= [];
//             result.body.daily.data.map(forecast => silasEvent.push( new FormattedTimeAndWeather(forecast)));
//             response.send(silasEvent)
//             return silasEvent;
//         })
// }




  function handleError(err, response) {
    console.log(err);
    if (response) response.status(500).send('You are wrong. Merry Christmas');
  }



console.log('LOCATIONS END FIRING');

app.listen(PORT, () => {
    console.log("Port is working and listening  onnnnn port " + PORT)
});