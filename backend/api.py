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
    latitude = data['latitude']
    longitude = data['longitude']
    
    # Insert data into MySQL
    conn = get_db_connection()
    cursor = conn.cursor()
    
    print(request_date)
    # Retrieve the row with the clostest datetime and closest latitude and longitude
    cursor.execute("""
        SELECT * FROM energy_data 
        WHERE date = ?
        AND ABS(latitude - ?) < 0.01 
        AND ABS(longitude - ?) < 0.01 
        ORDER BY time ASC
    """, (request_date,latitude, longitude))
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
            'Time': row[3],
            'Price (per kWh)': row[5],
            'Source (Primary)': row[6],
            '% Clean Energy': row[7],
            'Load (0-100%)': row[8]
        })
    return jsonify(response)

if __name__ == '__main__':
    app.run()