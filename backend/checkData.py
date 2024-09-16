import sqlite3

# Connect to SQLite database
conn = sqlite3.connect('energy_data.db')
cursor = conn.cursor()

# Query the energy_data table
cursor.execute("SELECT * FROM energy_data")
rows = cursor.fetchall()

# Print the retrieved data
for row in rows:
    print(row)

# Close the connection
cursor.close()
conn.close()