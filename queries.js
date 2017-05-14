var promise = require('bluebird'); // http://bluebirdjs.com/docs/getting-started.html
var pgp = require('pg-promise')(options); // https://github.com/vitaly-t/pg-promise

var options = {
  promiseLib: promise // initialization options
};

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
    })
    .catch(function (err) {
      return next(err);
    });
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
    })
    .catch(function (err) {
      return next(err);
    });
}

// add query functions to app 
module.exports = {
  getOttawa: getOttawa,
  getGatineau: getGatineau, 
  getProperties: getProperties
};
