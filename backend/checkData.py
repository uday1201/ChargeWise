import sqlite3

def check_data(cursor, table):
    # Query the energy_data table
    cursor.execute(f"SELECT * FROM {table}")
    rows = cursor.fetchall()

    # Print the retrieved data
    for row in rows:
        print(row)

# Connect to SQLite database
conn = sqlite3.connect('energy_data.db')
cursor = conn.cursor()

# Query the energy_data table
cursor.execute("SELECT * FROM PriceData limit 10")
rows = cursor.fetchall()

# Print the retrieved data
for row in rows:
    print(row)


check_data(cursor, 'energy_data')
check_data(cursor, 'load_forecast')
check_data(cursor, 'wx_forecast')

# Close the connection
cursor.close()
conn.close()