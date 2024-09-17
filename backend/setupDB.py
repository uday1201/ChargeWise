import sqlite3

conn = sqlite3.connect('energy_data.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE energy_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    time TEXT NOT NULL,
    timezone TEXT NOT NULL,
    price_per_kwh REAL NOT NULL,
    source_primary TEXT NOT NULL,
    percent_clean_energy REAL NOT NULL,
    load INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
)
''')

conn.commit()
cursor.close()
conn.close()