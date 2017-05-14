var promise = require('bluebird'); // http://bluebirdjs.com/docs/getting-started.html
var pgp = require('pg-promise')(options); // https://github.com/vitaly-t/pg-promise

var options = {
  promiseLib: promise // initialization options
};

<<<<<<< HEAD
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:january2017*@127.0.0.1/osm_canada'; // Heroku postgres OR local host postgres inventory database @localhost:5432
var db = pgp(connectionString); // using pg-promise, create database with connection details

// Express middleware: function that will return all the rows' geometries and building type properties in Ottawa in the postgres database
function getOttawa(req, res, next) {
  var geom = [];
  db.each('select ST_AsGeoJSON(wkb_geometry)::json as geometry, building as type from ottawa', [], row => {
    var featureType = row.geometry.type;
    if (featureType == "Polygon") { // some times features have points, so remove them
      geom.push(row);
    }
  })
    .then(function (data) {
      res.send(geom);
=======
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:january2017*@localhost:5432/osm_canada'; // Heroku postgres OR local host postgres inventory database @127.0.0.1
var db = pgp(connectionString); // using pg-promise, create database with connection details

// Express middleware: function that will return all the rows in the postgres database
function getOttawa(req, res, next) {
  db.query('select ST_AsGeoJSON(wkb_geometry)::json from ottawa')
    .then(function (data) {
      res.status(200)
        .json({
          type: "FeatureCollection",
          features: [
          {
            type: "Feature",
            geometry: data[5].st_asgeojson
          }]
      })
    })
    .then(function(row){
      console.log(row)
>>>>>>> 5deed5500c2e5a9c22a854d87970a14337c63e6f
    })
    .catch(function (err) {
      return next(err);
    });
<<<<<<< HEAD
}

// Express middleware: function that will return all the rows' geometries and building type properties in Gatineau in the postgres database
function getGatineau(req, res, next) {
  var geom = [];
  db.each('select ST_AsGeoJSON(wkb_geometry)::json as geometry, building as type from gatineau', [], row => {
    var featureType = row.geometry.type;
    if (featureType == "Polygon") {
      geom.push(row);
    }
  })
    .then(function (data) {
      res.send(geom);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getProperties(req, res, next){
  db.many('select ST_AsGeoJSON(wkb_geometry)::json as geometry, building as properties from gatineau')
    .then(function (data) {
      res.send(data);
=======
     

}

function getGatineau(req, res, next) {
  var test = db.any('select st_asgeojson(wkb_geometry) from gatineau')
    .then(function (data) {
      res.status(200)
        .json({
          data: data
        });
>>>>>>> 5deed5500c2e5a9c22a854d87970a14337c63e6f
    })
    .catch(function (err) {
      return next(err);
    });
}

// add query functions to app 
module.exports = {
  getOttawa: getOttawa,
<<<<<<< HEAD
  getGatineau: getGatineau, 
  getProperties: getProperties
=======
  getGatineau: getGatineau
>>>>>>> 5deed5500c2e5a9c22a854d87970a14337c63e6f
};
