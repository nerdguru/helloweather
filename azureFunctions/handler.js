'use strict';

var request = require('request');

module.exports.hello = (context, req) => {
  var location = req.query.location || 'New Orleans, LA';
  var url = 'https://query.yahooapis.com/v1/public/yql?q=select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")&format=json';

  request.get(url, function(error, response, body) {
    if (error) {
      console.error(error);
	  // Azure Functions response mechanics, build a JSON string and set context.done
	  const response = {
	    statusCode: 400,
	    message: error,
	  };
	  callback(new Error('Couldn\'t create the todo item.'));
    } else {
      var condition = JSON.parse(body).query.results.channel.item.condition;
      var text = condition.text;
      var temperature = condition.temp;
      var output = 'Hello, it is ' + temperature + ' degrees in ' + location + ' and ' + text;
      console.log("Success:" + output);
	 // Azure Functions response mechanics, build a JSON string and set context.done
	  const response = {
	    statusCode: 200,
	    message: output,
	  };
	  context.done(null, response);
    }
  });
};
