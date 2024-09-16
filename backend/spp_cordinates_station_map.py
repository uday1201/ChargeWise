import json
import sqlite3

# JSON data from file spp_csws_wx_data.json
with open('spp_csws_wx_data.json', 'r') as file:
    json_data = file.read()

# Parse JSON data
data = json.loads(json_data)

stations = []
# Extract relevant fields
for item in data["AllItems"]:
    print("StationNum: ", item["StationName"])
    station_num = item["StationNum"]
    latitude = item["coordinatesValue"]["Latitude"]
    longitude = item["coordinatesValue"]["Longitude"]
    station_name = item["StationName"]

    # Prepare data for insertion
    stations.append((station_num, latitude, longitude, station_name))

# Connect to SQLite database (or create it)
conn = sqlite3.connect('energy_data.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS Stations (
    StationNum INTEGER PRIMARY KEY,
    Latitude REAL,
    Longitude REAL,
    StationName TEXT
)
''')

# Insert data into table
cursor.executemany('''
INSERT INTO Stations (StationNum, Latitude, Longitude, StationName)
VALUES (?, ?, ?, ?)
''', stations)

# Commit and close connection
conn.commit()
conn.close()