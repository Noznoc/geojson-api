## DESCRIPTION

The (beta) geojson-api was developed for a project that assess OpenStreetMap (OSM) building data for Ottawa and Gatineau. This app uses a RESTful API to pull geojson files for Ottawa and Gatineau stored in a PostgreSQL/PostGIS database. 

## TO INSTALL

Really rough guide, detailed steps to come

To install to manage database locally: OSGeo4W (or just install GDAL), PostgreSQL 9.6, pgAdmin4 v1 and PostGIS 2.3.2. 

First you will need to import your geojson file into a PostgreSQL database. To accomplish this, first create a PostgreSQL database with the PostGIS extension. This can be done in pgAdmin4. Take note of the following database credentials: database name, user, and password

To import a geojson file into a new table in the database you just created, you will need to use GDAL's ogr2ogr. First, add the GDAL folder path to my environmental variables. Then in the OSGeo4w Shell, go to the directory with the geojson data and then entered the following:

ogr2ogr -f "PostgreSQL" PG:"dbname=[enter db name] user=[enter user] password=[enter password]" "[geojson file name]" -nln [table name] -append

After running this, go to pgAdmin4, your database should now have a new table with all the geojson data in it. The geometry is stored as a wkb_geometry column

Now that your database exists with the geojson data, you can run the API locally from the code. However, there is one key line you will have to change to make the API access your local database: 

In queries.js you will neeed to change the database URL credentials on line 10 to your own database credentials

Apart from that, the query functions in queries.js (e.g., getOttawa()) will need to be altered based off what you want to pull from the database (you will also need to change the routes). The current code pulls the wkb_geometry from two different tables (one holds all OSM building data from Ottawa and the other holds all OSM building data from Ottawa) and then converts them into geojson.