const request = require("postman-request");

const forecast = (location, latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=57d368286c820854fba2347f0198a55f&query=${latitude},${longitude}&units=f`;
  //note destructuring of response obj in param, to just body
  request({ url, json: true }, (error, { body } = {}) => {
    // error popul. when its a low level os error, like no network,or no api/server,not when server
    // sends data repping error, say from bad query input, below ex of defensive programming
    if (error) {
      callback("Unable to connect to weather service.", undefined);
    } else if (body.error) {
      callback(`Unable to find location. ${body.error.info}`, undefined);
    } else {
      const { temperature, feelslike, weather_descriptions } = body.current;

      callback(
        undefined,
        `Condition outside: ${weather_descriptions[0]}. It's currently ${temperature} degrees out, but it feels like ${feelslike} degrees.`
      );
    }
  });
};

module.exports = forecast;
