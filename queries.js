// source code: http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/#.WOK8RvkrJPb

var promise = require('bluebird'); // http://bluebirdjs.com/docs/getting-started.html
var pgp = require('pg-promise')(options); // https://github.com/vitaly-t/pg-promise

var options = {
  promiseLib: promise // initialization options
};

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
    })
    .catch(function (err) {
      return next(err);
    });
     

}

function getGatineau(req, res, next) {
  var test = db.any('select st_asgeojson(wkb_geometry) from gatineau')
    .then(function (data) {
      res.status(200)
        .json({
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// add query functions to app 
module.exports = {
  getOttawa: getOttawa,
  getGatineau: getGatineau
};
