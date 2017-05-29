var promise = require('bluebird'); // http://bluebirdjs.com/docs/getting-started.html
var pgp = require('pg-promise')(options); // https://github.com/vitaly-t/pg-promise

var options = {
  promiseLib: promise // initialization options
};

var connectionString = process.env.DATABASE_URL || 'postgres://postgres:january2017*@127.0.0.1/osm_canada'; // Heroku postgres OR local host postgres inventory database @localhost:5432
var db = pgp(connectionString); // using pg-promise, create database with connection details

// this calculates the area of all polygons. Units are in squared meters
function area(req, res, next){
  var area = 0;
  // for each polygon convert the geometry from degrees and then calculate the area
  db.each('select ST_Area(wkb_geometry::geography) as area from ottawa', [], row => {
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
}

function match(req, res, next){
  db.any('select ottawa.ogc_fid as ott_osm, ST_AsGeoJSON(ottawa.wkb_geometry)::json as ott_osm_geom, ottawa_ref.ogc_fid as ott_ref, ST_AsGeoJSON(ottawa_ref.wkb_geometry)::json as ott_ref_geom from ottawa, ottawa_ref where ST_Intersects(ottawa.wkb_geometry, ottawa_ref.wkb_geometry) and (ST_Area(ST_Intersection(ottawa.wkb_geometry, ottawa_ref.wkb_geometry)) / ST_Area(ST_Union(ottawa.wkb_geometry, ottawa_ref.wkb_geometry))) > 0.3') //and (ST_Area(ST_Intersection(ottawa.wkb_geometry, ottawa_ref.wkb_geometry)) / least(ST_Area(ottawa.wkb_geometry), ST_Area(ottawa_ref.wkb_geometry))) > 0.3
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

function getId(req, res, next){
  var id = req.params.id;
  var city = req.params.city;
  db.any('select ST_AsGeoJSON(wkb_geometry)::json as geometry from ' + city + ' where ogc_fid = ' + id)
    .then(function (data) {
        res.status(200)
          .json({
            type: 'geojson',
            data: {
              'type': 'Feature',
              'geometry': data[0].geometry
            }
          });
      })
    .catch(function (err) {
      return next(err);
    });
}
  
// this Express middleware function gets the data based on the url request
function getData(req, res, next) {
  var geom = [], // to store the geometry 
      geojson = [], // to store the complete geojsons
      city = req.params.id; // to store the city requested from user
  // for each row in the database select the geometry and building type and centroid from the city's table
  db.each('select ST_AsGeoJSON(wkb_geometry)::json as geometry, building as type, ST_Area(wkb_geometry::geography) as area, ST_AsGeoJSON(ST_Centroid(wkb_geometry))::json as centroid from ' + city, [], row => {
    var featureType = row.geometry.type, // store the feature type (e.g., polygon, point)
        buildingType = row.type; // store the building type

    // if the feature is a polygon
    if (featureType == "Polygon") {
      // create a single geojson's geometry and properties for the given row 
      var data = {
        'type': 'Feature',
        'geometry': row.geometry,
        'properties': {
          'building': row.type,
          'area': row.area,
          'centroid': row.centroid,
          'user': row.username
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
  getData: getData,
  match: match,
  area: area,
  getId: getId
};
