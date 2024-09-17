# ChargeWise
This project provides an API to fetch aggregated energy data based on various parameters such as date, day of the week, time, timezone, primary energy source, and percentage of clean energy.

# Features
Fetch aggregated energy data
Filter data by date
Provides information on average load, price per kWh, and more

# Requirements
Python 3.x
Flask
SQLite3

# Setup
- Clone the repository:
`
git clone https://github.com/yourusername/energy-data-api.git
cd energy-data-api
`

- Install the required packages:
`
pip install -r requirements.txt
`

- Run the application:
`
python api.py
`

# Usage
- Send a GET request to the API endpoint with the required parameters to fetch the aggregated energy data.

`
POST /data HTTP/1.1
Host: 127.0.0.1:5000
Content-Type: application/json
Content-Length: 32
{
    "datetime": "2024-09-15"
}
`


