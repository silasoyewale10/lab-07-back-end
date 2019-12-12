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

app.get('/events', getEvents);

app.get('/location', handleLocationRequest)
function handleLocationRequest(request, response) {
    // const quer = request.query.data;
    superagent.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`
        ).then(result => {
    const place = new FormattedData (request.query.data, result);
    // console.log('request.query.data is ' )
    
    response.send(place)
})
.catch(err => handleError (err, response))
}


function FormattedTimeAndWeather(resultBody) {
    
    this.forecast = resultBody.summary
    this.time = new Date(resultBody.time * 1000).toDateString();
}



// app.get('/weather', handleWeatherRequest)

// function weatherFrontEnd (req, res){
//     return handleWeatherRequest(req.query.data || 'Lynnwood, WA, USA')
//     .then(result => {
//         res.send(result)
//     })
// }



function handleWeatherRequest(search) {
    // console.log(request.query.data)
    
    superagent.get(
        `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${search.latitude},${search.longitude}`
        ).then(result => {

            var output = [];
            result.body.daily.data.map(dailyWeather => output.push(new FormattedTimeAndWeather(dailyWeather)))
            return output;
            // response.send(weather)
        })
}





function getEvents(req, res){
    console.log(req.query);
    // go to eventful, get data and get it to look like this
    superagent.get(`http://api.eventful.com/json/events/search?app_key=kcbDf9m2gZnd2bBR&keywords=football&location=${req.query.data.formatted_query}&date=Future`).then(response => {
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









  function handleError(err, response) {
    // console.log(err);
    if (response) response.status(500).send('You are wrong. Merry Christmas');
  }



console.log('LOCATIONS END FIRING');

app.listen(PORT, () => {
    console.log("Port is working and listening  onnnnn port " + PORT)
});