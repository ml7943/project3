import sqlite3
import csv

# Create the SQLite database
conn = sqlite3.connect('NYC_Crime.db')

# Create a cursor object to interact with the database
cursor = conn.cursor()

# Create the table if it doesn't exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS NYC_crimes (
        "Complaint No." TEXT PRIMARY KEY,    
        "Complaint Date" TEXT,
        "Offense" TEXT,
        "Law Cat" TEXT,
        "Borough" TEXT,
        "Latitude" REAL,
        "Longitude" REAL   
    )
""")

# Open and read the CSV file
with open('shrunk_crime.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file)



# Open and read the CSV file
with open('shrunk_crime.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file)
    
    # Skip the header row if it exists
    next(csv_reader, None)
     
    # Read all rows from the CSV file and perform data type conversion
    rows = []
    for row in csv_reader:
        complaint_no = row[0]
        complaint_date = row[1]
        offense = row[2]
        law_cat = row[3]
        borough = row[4]
        
        # Check for empty or non-numeric values before converting to float
        latitude = float(row[5]) if row[5] else None
        longitude = float(row[6]) if row[6] else None
        
        rows.append((complaint_no, complaint_date, offense, law_cat, borough, latitude, longitude))

    # Read all rows from the CSV file into a list
    rows = [row for row in csv_reader]

# Insert all data into the 'NYC_crimes' table in a single batch
cursor.executemany("""
    INSERT INTO NYC_crimes 
    ("Complaint No.", "Complaint Date", "Offense", "Law Cat", "Borough", "Latitude", "Longitude") 
    VALUES (?, ?, ?, ?, ?, ?, ?)
""", rows)

# Commit the transaction
conn.commit()

# Close the database connection
conn.close()

