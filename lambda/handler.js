'use strict';

var request = require('request');

module.exports.hello = (event, context, callback) => {
  // Lambda input signature, get location from event.location
  var location = event.location || 'New Orleans, LA';
  var url = 'https://query.yahooapis.com/v1/public/yql?q=select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")&format=json';

  request.get(url, function(error, response, body) {
    if (error) {
      console.error(error);
	  // Lambda response mechanics, build a JSON string and call the callback function
	  callback(new Error('Couldn\'t create the todo item.'));
    } else {
      var condition = JSON.parse(body).query.results.channel.item.condition;
      var text = condition.text;
      var temperature = condition.temp;
      var output = 'Hello, it is ' + temperature + ' degrees in ' + location + ' and ' + text;
      console.log("Success:" + output);
	  // Lambda response mechanics, build a JSON string and call the callback function
	  const response = {
	    statusCode: 200,
	    message: output,
	  };
	  callback(null, response);
    }
  });
};
