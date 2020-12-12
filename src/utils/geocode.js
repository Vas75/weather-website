const request = require("postman-request");

const geocode = (address, callback) => {
  const encodedAddress = encodeURIComponent(address);

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=pk.eyJ1IjoicGhpbGxpcHZwaGlsbGlwb3YiLCJhIjoiY2tpNWR0dXl2MTk3cTJybGw2b2NxaXJ2aCJ9.IrCdodO9yiiJUE81y_jjlw&limit=1`;

  //below uses obj destruct in paramaters, {body} = response
  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      //I added check for mssg, if mssg on body, is error, no features array, prog crashes
      callback("Unable to connect to location services.", undefined);
    } else if (body.message || body.features.length === 0) {
      callback("Unable to find location. Try another search.", undefined);
    } else {
      const location = body.features[0].place_name;
      const latitude = body.features[0].center[1];
      const longitude = body.features[0].center[0];

      callback(undefined, { location, latitude, longitude });
    }
  });
};

module.exports = geocode;

/*

gecoding is taking an address and converting it to latitude and longitude coordinate pair
will be using to pass co. pair to weatherstack
address->lat+lon via api->weather via weatherstack

Below call searches for los angeles, return 1 result due limit 1.
mapbox api endpoint: https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1IjoicGhpbGxpcHZwaGlsbGlwb3YiLCJhIjoiY2tpNWR0dXl2MTk3cTJybGw2b2NxaXJ2aCJ9.IrCdodO9yiiJUE81y_jjlw&limit=1
*/
