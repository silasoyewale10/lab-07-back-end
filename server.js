'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
const app = express();
app.use(cors());

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






function getWeather(req, res){
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