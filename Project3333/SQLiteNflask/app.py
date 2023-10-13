# Import the dependencies.
import sqlalchemy
from flask import Flask, jsonify
from sqlalchemy import create_engine, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

#################################################
# Database Setup
#################################################


# Create engine using the `nycCrime.sqlite` database file
engine = create_engine("sqlite:///NYC_Crime.sqlite")


# reflect an existing database into a new model
Base = automap_base()


# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station


# Create our session (link) from Python to the DB

#################################################
# Flask Setup
#################################################
# app = Flask(__name__)


#################################################
# Flask Routes
#################################################

# Start at the home page, list all routes that are available.   
# @app.route("/")
# def home():
#     return (
#         f"Welcome to the NYC_Crime API!<br/>"
        
        
        
#         f"Available Routes:<br/>"
#         f"/api/v1.0/precipitation<br/>"
#         f"/api/v1.0/stations<br/>"
#         f"/api/v1.0/tobs<br/>"
#         f"/api/v1.0/<start><br/>"
#         f"/api/v1.0/<start>/<end><br/>"
#     )  
    
# # Define the precipitation route
# @app.route('/api/v1.0/precipitation')

# # Create a function to return the precipitation data as JSON
# def precipitation():
    
#     # Query the database for precipitation data
#     session = Session(engine)
    
#     results = session.query(Measurement.date, Measurement.prcp).\
#         filter(Measurement.date >= '2016-08-23').\
#         order_by(Measurement.date).all()
    
#   # Convert the query results into a dictionary
#     precipitation_data = []
#     for date, prcp in results:
#         precipitation_dict = {}
#         precipitation_dict["Date"] = date
#         precipitation_dict["Precipitation"] = prcp
#         precipitation_data.append(precipitation_dict)

#     # Close the session
#     session.close()
    
#     # Return the precipitation data as JSON
#     return jsonify(precipitation_data)



# # Define the stations route
# @app.route('/api/v1.0/stations')

# # Create a function to return the station data as JSON
# def stations():
    
#     # Query the database for station data
#     session = Session(engine)
    
#     # Create a list for the station data
#     station_list = [{'id': id, 'name': loc} for id, loc in session.query(Station.station, Station.name).all()]
    
#     # Close the session
#     session.close()
    
#     # Return the list as JSON
#     return jsonify(station_list)



# # Define the temp observations route for the most active station
# @app.route('/api/v1.0/tobs')

# # Create a function to return the last year of temperature observations data as JSON for the most active station
# def tobs():
    
#     # Query the database for temperature observations data
#     session = Session(engine)
    
#     temp_obs_data = session.query(Measurement.date, Measurement.tobs).\
#     filter(Measurement.date >= '2016-08-23', Station.station == 'USC00519281').\
#         order_by(Measurement.date).all()
    
#     # Create a dictionary for the temperature observations data   
#     temp_obs_dict = {row.date: row.tobs for row in temp_obs_data}
    
#     # Close the session
#     session.close()
    
#     return jsonify(temp_obs_dict)



# # Define the start/end routes

# @app.route('/api/v1.0/<start>')
# @app.route('/api/v1.0/<start>/<end>')
# def temp_range(start,end = '2017-08-23'):   
    
#     session = Session(engine)

#     # Query the database for temperature data on the speciifed
#     results = session.query(
#         func.min(Measurement.tobs).label('min_temp'),
#         func.avg(Measurement.tobs).label('avg_temp'),
#         func.max(Measurement.tobs).label('max_temp')
#     ).filter(Measurement.date >=start, Measurement.date<=end).first()

#     # Extract the temperature data from the query result
#     min_temp, avg_temp, max_temp = results

#     # Create a dictionary to store the temperature data
#     range_temp_data = {
#         "TMIN": min_temp,
#         "TAVG": avg_temp,
#         "TMAX": max_temp
#     }

#     # Close the session
#     session.close()
    
#     # Return the temperature data as JSON
#     return jsonify(range_temp_data)

# if __name__ == '__main__':
#     app.run(debug=True)
    