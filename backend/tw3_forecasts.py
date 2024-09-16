import http.client
import json
import sqlite3

def get_tw3_fcst(endpoint, model_name, start_date, end_date):
    conn = http.client.HTTPSConnection("teslaforecast.us")
    payload = json.dumps({
    "ModelName": model_name,
    "TimeStart": start_date,
    "TimeEnd": end_date,
    "LoadAct": True,
    "TimeMap": "UTC"
    })
    headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImJudXJpIiwicm9sZSI6IlRFU0xBV2ViVXNlciIsIndlYnNpdGUiOiJUZXNsYVdlYjMuQVBJIiwibmJmIjoxNzI2NTE4MTU0LCJleHAiOjE3MjcxMjI5NTQsImlhdCI6MTcyNjUxODE1NCwiaXNzIjoiVEVTTEEifQ.ggsHBu2hAJj2wbxMhZEJ9PPTtFg13lJRfg0n1x6Bf04'
    }
    url = f"/TeslaWeb3/api/v1/LoadFcst/{endpoint}"
    
    # Make the request
    conn.request("POST", url, payload, headers)
    res = conn.getresponse()

    # Read and decode the byte response
    data = res.read().decode('utf-8')
    
    # Parse the JSON data into a Python dictionary
    json_data = json.loads(data)
    
    # Return the 'LoadForecastTable' if it exists
    if 'LoadForecastTable' in json_data:
        return json_data['LoadForecastTable']
    else:
        return None



def insert_data_to_table(load_fcst_data, table, cursor, conn):
        # Check if the data contains any rows
    if not load_fcst_data:
        raise ValueError("No data provided to insert.")

    # Get the keys (columns) from the first dictionary in the list
    first_row = load_fcst_data[0]
    
    # Dynamically build the CREATE TABLE statement based on dictionary keys
    columns = ', '.join([f"{key} REAL" if isinstance(first_row[key], (int, float)) else f"{key} TEXT" for key in first_row.keys()])
    
    # Add the 'id' column as the primary key
    create_table_query = f'''
    CREATE TABLE IF NOT EXISTS {table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        {columns}
    )
    '''

    # Execute the table creation query
    cursor.execute(create_table_query)
    # Commit the transaction
    conn.commit()

    for data in load_fcst_data:
        # Get the dictionary keys (column names) and values dynamically
        columns = ', '.join(data.keys())  # Generate a string of column names
        placeholders = ', '.join(['?' for _ in data])  # Create placeholders for the values
        
        # Generate the query dynamically using the column names
        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        
        # Execute the query with the corresponding values
        cursor.execute(query, tuple(data.values()))  # Pass the values as a tuple

    # Commit the transaction
    conn.commit()

#get tw3 forecast data
model_name = 'TESLA: SPP-CSWS'
start_date = '2024-09-16'
end_date = '2024-09-23'
load_fcst_data = get_tw3_fcst('Standard', model_name, start_date, end_date)
wx_data = get_tw3_fcst('Wx', 'TESLA: SPP-CSWS', start_date, end_date)


# Connect to SQLite database
conn = sqlite3.connect('backend/energy_data.db')
cursor = conn.cursor()
insert_data_to_table(load_fcst_data, 'load_forecast', cursor, conn)
insert_data_to_table(wx_data, 'wx_forecast', cursor, conn)

# Close the connection
cursor.close()
conn.close()