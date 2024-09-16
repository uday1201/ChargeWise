from flask import Flask, request, jsonify
import mysql.connector
from datetime import datetime

app = Flask(__name__)

# MySQL configuration
db_config = {
    'user': 'your_username',
    'password': 'your_password',
    'host': 'your_host',
    'database': 'your_database'
}

# Connect to MySQL
def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/data', methods=['POST'])
def add_data():
    data = request.json
    request_datetime = datetime.strptime(data['current_datetime'], '%Y-%m-%d %H:%M:%S')
    latitude = data['latitude']
    longitude = data['longitude']
    
    # Extract fields from datetime object
    date = request_datetime.date()
    time = request_datetime.time()
    
    # Insert data into MySQL
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Retrieve the row with the clostest datetime and closest latitude and longitude
    cursor.execute("SELECT * FROM energy_data WHERE ABS(latitude - %s) < 0.01 AND ABS(longitude - %s) < 0.01 ORDER BY ABS(current_datetime - %s) LIMIT 1", (latitude, longitude, request_datetime))
    fetched_data = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    # Prepare response
    response = {
        'Date': fetched_data[1],
        'Day of Week': fetched_data[2],
        'Time': fetched_data[3],
        'Timezone': fetched_data[4],
        'Price (per kWh)': fetched_data[5],
        'Source (Primary)': fetched_data[6],
        '% Clean Energy': fetched_data[7],
        'Load (0-100%)': fetched_data[8],
        'Latitude': fetched_data[9],
        'Longitude': fetched_data[10],
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)