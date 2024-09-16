import sqlite3
import csv

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('energy_data.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS energy_generation (
    datetime TEXT,
    wind REAL,
    solar REAL,
    coal REAL
)
''')

conn.commit()

# Open the CSV file
with open('data/gen.csv', 'r') as file:
    reader = csv.reader(file)
    next(reader)  # Skip the header row

    # Insert data into the table
    for row in reader:
        cursor.execute('''
        INSERT INTO energy_generation (datetime, wind, solar, coal)
        VALUES (?, ?, ?, ?)
        ''', row[:-1])

conn.commit()
conn.close()