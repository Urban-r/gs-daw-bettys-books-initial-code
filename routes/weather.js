// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

// Handle our routes
router.get('/londonnow',function(req, res, next){
    let apiKey = '39f8acafce3e4c99c1ff53b9a834e06e'
        let city = 'london'
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
                     
        request(url, function (err, response, body) {
          if(err){
            next(err)
          } else {
            var weather = JSON.parse(body)
            if (weather!==undefined && weather.main!==undefined) {
              var wmsg = 'It is '+ weather.main.temp + 
              ' degrees in '+ weather.name +
              '! <br> The humidity now is: ' + 
              weather.main.humidity;
              res.send (wmsg);
            }else{
              res.send('Error: City not found! Please try again!')
            }
          } 
        });
})
router.get('/citynow',function(req, res, next){
  res.render('citynow.ejs')
})

router.post('/citynowed',function(req, res, next){
  let apiKey = '39f8acafce3e4c99c1ff53b9a834e06e'
  let city = req.body.city
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      next(err)
    } else {
      var weather = JSON.parse(body)
      var wmsg = 'It is '+ weather.main.temp + 
      ' degrees in '+ weather.name +
      '! <br> The humidity now is: ' + 
      weather.main.humidity;
      res.send (wmsg);
    } 
  });
})

// Export the router object so index.js can access it
module.exports = router