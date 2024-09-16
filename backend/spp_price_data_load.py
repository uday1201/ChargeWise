import json
import sqlite3

# Load JSON data from file
with open('data/spp_price_data.json', 'r') as file:
    json_data = file.read()

# Parse JSON data
datafile = json.loads(json_data)

# Extract relevant fields
price_data = []
for data in datafile["recordset"]:
    price_data.append([
        data["LAT"],
        data["LON"],
        data["DATETIME"],
        data["VALUE"],
        data["PNODENAME"],
        data["UNITS"]]
    )

# Connect to SQLite database (or create it)
conn = sqlite3.connect('energy_data.db')
cursor = conn.cursor()

# Delete existing table if it exists
cursor.execute('DROP TABLE IF EXISTS PriceData')
# Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS PriceData (
    LAT REAL,
    LON REAL,
    DATE TEXT,
    TIME TEXT,
    VALUE REAL,
    PNODENAME TEXT,
    UNITS TEXT
)
''')

# Insert data into table
for price in price_data:
    cursor.execute('''
    INSERT INTO PriceData (LAT, LON, DATETIME, VALUE, PNODENAME, UNITS)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', price)

# Commit and close connection
conn.commit()
conn.close()