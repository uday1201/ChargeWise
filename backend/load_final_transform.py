import sqlite3

# Connect to SQLite database
conn = sqlite3.connect('energy_data.db')
cursor = conn.cursor()

# Query the energy_data table
cursor.execute('''WITH wx_forecast_data AS (
    SELECT
        date,
        time,
        CASE
            WHEN date % 7 = 0 THEN 'Sunday'
            WHEN date % 7 = 1 THEN 'Monday'
            WHEN date % 7 = 2 THEN 'Tuesday'
            WHEN date % 7 = 3 THEN 'Wednesday'
            WHEN date % 7 = 4 THEN 'Thursday'
            WHEN date % 7 = 5 THEN 'Friday'
            WHEN date % 7 = 6 THEN 'Saturday'
        END AS day_of_week,
        LAW_tempf as temperature,
        'UTC' AS timezone,
        
    FROM wx_forecast
),
energy_generation AS (
    SELECT
        datetime,
        wind,
        solar,
        coal
    FROM energy_generation
),
price_data AS (
    SELECT
        LAT AS latitude,
        LON AS longitude,
        DATETIME,
        VALUE AS price_per_kwh,
        PNODENAME AS source_primary
    FROM PriceData
),
load_data AS (
    SELECT
        date,
        time,
        load_fcst AS load
    FROM load_forecast
)
INSERT INTO energy_data (id, date, day_of_week, time, timezone, price_per_kwh, source_primary, percent_clean_energy, load, latitude, longitude)
SELECT 
    ROW_NUMBER() OVER (ORDER BY p.DATETIME) AS id,
    DATE(p.DATETIME) AS date,
    w.day_of_week,
    TIME(p.DATETIME) AS time,
    w.timezone,
    p.price_per_kwh,
    p.source_primary,
    (e.wind + e.solar) / (e.wind + e.solar + e.coal) * 100 AS percent_clean_energy,
    l.load,
    p.latitude,
    p.longitude
FROM price_data p
JOIN wx_forecast_data w ON DATE(p.DATETIME) = w.date AND TIME(p.DATETIME) = w.time
JOIN energy_generation e ON p.DATETIME = e.datetime
JOIN load_data l ON DATE(p.DATETIME) = l.date AND TIME(p.DATETIME) = l.time;
''')

# Commit the transaction
conn.commit()

# Close the connection
conn.close()