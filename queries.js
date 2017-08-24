var promise = require('bluebird'); // http://bluebirdjs.com/docs/getting-started.html
var pgp = require('pg-promise')(options); // https://github.com/vitaly-t/pg-promise

var options = {
  promiseLib: promise // initialization options
};

var connectionString = process.env.DATABASE_URL || 'postgres://postgres:cgvj1962@localhost:5433/geojson-api'; // Heroku postgres OR local host postgres inventory database @127.0.0.1
var db = pgp(connectionString); // using pg-promise, create database with connection details

/* this calculates the area of all polygons. Units are in squared meters
function area(req, res, next){
  var area = 0;
  // for each polygon convert the geometry from degrees and then calculate the area
  db.each('select ST_Area(wkb_geometry::geography) as area from [table]', [], row => {
    area += row.area; // add the area to the polygon
  })
    .then(function () {
      res.status(200)
        .json({
          area: area
        });
    })
    .catch(function (err) {
      return next(err);
    });
}*/
  
// this Express middleware function gets the data based on the url request
function getData(req, res, next) {
  var geom = [], // to store the geometry 
      geojson = [], // to store the complete geojsons
      city = req.params.id; // to store the city requested from user

  console.log(req.params.id)
  // for each row in the database select the geometry and building type and centroid from the city's table
  db.each('select ST_AsGeoJSON(wkb_geometry)::json as geometry, type, name from ' + city, [], row => {
    var featureType = row.geometry.type; // store the feature type (e.g., polygon, point)

    // if the feature is a polygon
    if (featureType == 'Polygon') {
      // create a single geojson's geometry and properties for the given row 
      var data = {
        'type': 'Feature',
        'geometry': row.geometry,
        'properties': {
          'type': row.type
        }
      }
      geom.push(data); // push the geojson geometry and properties data in the geom array 
    } 

    // if the feature is a point
    if (featureType == 'Point'){
      var data = {
        'type': 'Feature',
        'geometry': row.geometry,
        'properties': {
          'amenity': row.type,
          'name': row.name
        }
      }
      geom.push(data); // push the geojson geometry and properties data in the geom array 
    }

  })
    .then(function () { // then create a complete feature collection from all the geojson geometry and properties
      var data = {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': geom
        }
      }
      geojson.push(data)
    })
    .then (function (data) {
      res.send(geojson); // this will send the final geojson feature collection to the client
    })
    .catch(function (err) {
      return next(err);
    });
}

// add query functions to app 
module.exports = {
  getData: getData
};
