# GeoJSON API

In general, the (beta) geojson-api was developed for a project that assesses [OpenStreetMap (OSM)](openstreetmap.org) city-level building data. That being said, the following documentation is to show how you can work with spatial data with open sourced tools as an alternative to proprietary software. 

Most of this work was accomplished through reading various sources and combining them together. The aim is to show how to store and handle large spatially-referenced data, and how to access the data through an API to repurpose the data however you please. In my case, I used the API to output the geojsons onto a Mapbox GL JS map that shows all the buildings based on a client selecting the city. I used data-driven styling for the buildings (e.g., color buildings based on the building type attribute). Mapbox GL JS is great because it has built in functions to handle large geojson files. With Mapbox GL JS, all buildings for Ottawa and Gatineau, Canada, can be projected and rendered onto a map seamlessly. 

# General Infrastructure

The OSM data was first downloaded from [Geofabrik](www.geofabrik.de/data/download.html) and converted into a geojson, but [Mapzen](https://mapzen.com/data/metro-extracts/) has OSM data in geoJSON format available for download as well. Geojson data was then stored in a [PostgreSQL](www.postgresql.org) and [PostGIS](postgis.net) database using [GDAL's ogr2ogr](www.gdal.org/ogr2ogr.html). Each city's building data is stored in its own table. This app uses a [Node](nodejs.org/en/) and [Express](expressjs.com) based RESTful API that uses [pg-promise](github.com/vitaly-t/pg-promise) to pull the data from the database. The pg-promise library is "built on top of [node-postgres](github.com/brianc/node-postgres)," which incorporates pooling for database querying. This will avoid choking the app if there are several queries, especially if there are several queries that are pulling large amounts of data. 

The following documentation highlights how to prepare your geojson data into a PostgreSQL/PostGIS database, how to connect a Node app's server to the local PostgreSQL database, how data is queried in the GitHub code, and how to use the API to access the data. 

# Getting Started

As my environment is Windows, the following instructions following this environment. 

## Prerequisites

The following should be installed locally to manage the database: [OSGeo4W (or just install GDAL)](trac.osgeo.org/osgeo4w/), [PostgreSQL 9.6](postgresql.org.download/), [pgAdmin4 v1](pgadmin.org/download/pgadmin-4-windows/) and [PostGIS 2.3.2](postgis.net/install/). 

## Data Management

First you will need to get your geojson data. There are several ways to accomplish this. In my case, pbfs of Ontario and Quebec were downloaded from Geofabrik and then [osmosis](github.com/openstreetmap/osmosis) was used to clip the data for only Ottawa and Gatineau and then convert the data into two geojsons for each city. 

I am used to handling most spatial data from the client/browser using JavaScript; but, with such a large geojson (239.509 MB for Ottawa and 78.332 for Gatineau), a database and server were developed. To accomplish this, I first created a PostgreSQL database with a PostGIS extension. This can be done through [pgAdmin4](pgadmin.org/docs/pgadmin4/1.x/). Take note of the following database credentials: database name, user, and password. These credentials will be necessary to connect your server to the database.

To import a geojson file into a new table in the PostgreSQL database you just created, you will need to use GDAL's ogr2ogr. (Note: There are other methods to accomplish this.) 

To use GDAL, if yor environment is Windows, add the GDAL folder path to your Control Panel > User Accounts > Change my environmental variables (e.g., C:\OSGeo4W64\share\gdal). Then, in the OSGeo4w Shell, go to the directory with the geojson data and then entered the following:

    ogr2ogr -f "PostgreSQL" PG:"dbname=[enter db name] user=[enter user] password=[enter password]" "[geojson file name]" -nln [table name] -append

**Text in [ ] indicates the info you will need to enter**

This line uses ogr2ogr to store a geojson file into a specific table from a specific PostgreSQL/PostGIS database. 

After running this line, go to pgAdmin4, your database should now have a new table with all the geojson data in it. The geometry is stored as a wkb_geometry column with the 4326 (WGS84) projected coordinate system. In my case, it was one of the last columns in the database.

## API Installation

Now that your database exists with geojson data, you can develop a server and web app that queries and visualizes the data. The server.js code creates the server, but queries.js connects and queries the database to the Node and Express based server. There is one key line you will have to change in queries.js to make the server access your local database: 

    var connectionString = process.env.DATABASE_URL || 'postgres://[user name]:[password]*@127.0.0.1/[database name]';

The process.env.DATABASE_URL is there just in case you want to use Heroku to store the database in the cloud.

The current query function (getData()) in queries.js pulls the wkb_geometry, the building type tag, the area, and the centroid from either table and then converts the query into a geojson feature collection.

# Deploy API / App

With your local database and the code, in the command line go into the directory with the code and enter:

    npm start

Then in a browser type the following URL:

	localhost:3000/[name of table in database]

The API should output the table's data as a geojson feature collection of building polygons.

# Authors

Julia Conzon



