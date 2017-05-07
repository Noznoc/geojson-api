## TO INSTALL

Really rough guide, detailed steps to come.

Install GDAL, Postgres 9.6 and pgAdmin4 v1 and PostGIS 2.3.2.

You will need to install GDAL and ogr2ogr to import a geojson file to the Postgres database. 

The following lines were used to add the Ottawa Building and Ottawa Building geojsons into Postgres

ogr2ogr -f "PostgreSQL" PG:"dbname=osm_canada user=postgres password=january2017*" "OttBuildW.geojson" -nln ottawa -append

ogr2ogr -f "PostgreSQL" PG:"dbname=osm_canada user=postgres password=january2017*" "GatBuildW.geojson" -nln gatineau -append

Then from the command line access the directory where the code is and enter:

npm start