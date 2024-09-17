from flask import Flask, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

# SQLite configuration
DATABASE = 'energy_data.db'

# Connect to SQLite
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/data', methods=['POST'])
def add_data():
    data = request.json
    request_date = data['datetime']
    
    # Insert data into MySQL
    conn = get_db_connection()
    cursor = conn.cursor()
    
    print(request_date)
    # Retrieve the row with the clostest datetime
    cursor.execute("""
        WITH aggregated_data AS (
        SELECT
            date,
            day_of_week,
            time,
            timezone,
            AVG(price_per_kwh) average_price,
            source_primary,
            percent_clean_energy,
            AVG(latitude) latitude,
            AVG(longitude) longitude,
            -- Aggregate the load
            AVG(load) AS average_load
        FROM energy_data
        WHERE date = ?
        GROUP BY
            date,
            day_of_week,
            time,
            timezone,
            source_primary,
            percent_clean_energy
    )
    SELECT
        date,
        day_of_week,
        time,
        timezone,
        average_price AS price_per_kwh,
        source_primary,
        percent_clean_energy,
        average_load AS load,
        latitude,
        longitude
    FROM aggregated_data;
    """, (request_date,))
    fetched_data = cursor.fetchall()
    cursor.close()
    conn.close() 
     
    # Prepare response
    if not fetched_data:
        return jsonify({'error': 'No data found for the given parameters'}), 404
    response = {
        'Date': fetched_data[0]['date'],
        'Day of Week': fetched_data[0]['day_of_week'],
        'Timezone': fetched_data[0]['timezone'],
        'Latitude': fetched_data[0]['latitude'],
        'Longitude': fetched_data[0]['longitude'],
        'Data Series': []
    }
    for row in fetched_data:
        response['Data Series'].append({
            'Time': row[2],
            'Price (per kWh)': row[4],
            'Source (Primary)': row[5],
            '% Clean Energy': row[6],
            'Load': row[7]
        })
    return jsonify(response)

if __name__ == '__main__':
    app.run()