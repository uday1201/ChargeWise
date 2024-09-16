import sqlite3
from datetime import datetime

# Dummy data
dummy_data = [
    {
        'date': '2024-09-16',
        'day_of_week': 'Monday',
        'time': '2024-09-16 12:00:00',
        'timezone': 'UTC',
        'price_per_kwh': 0.15,
        'source_primary': 'Solar',
        'percent_clean_energy': 75.0,
        'load': 50,
        'latitude': 40.016489,
        'longitude': -105.279
    },
    {
        'date': '2024-09-16',
        'day_of_week': 'Monday',
        'time': '2024-09-16 14:00:00',
        'timezone': 'UTC',
        'price_per_kwh': 0.20,
        'source_primary': 'Wind',
        'percent_clean_energy': 80.0,
        'load': 60,
        'latitude': 40.016489,
        'longitude': -105.279
    }
]

# Insert dummy data into the table
for data in dummy_data:
    cursor.execute('''
    INSERT INTO energy_data (date, day_of_week, time, timezone, price_per_kwh, source_primary, percent_clean_energy, load, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (data['date'], data['day_of_week'], data['time'], data['timezone'], data['price_per_kwh'], data['source_primary'], data['percent_clean_energy'], data['load'], data['latitude'], data['longitude']))

# Commit the transaction
conn.commit()

# Close the connection
cursor.close()
conn.close()