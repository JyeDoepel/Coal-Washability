import mysql.connector
import pandas as pd
import json
from dotenv import load_dotenv
import os

load_dotenv()

db_host = os.getenv("db_host")
db_user = os.getenv("db_user")
db_pass = os.getenv("db_pass")
db_db = os.getenv("db_db")

# db_host="20.70.237.120"
# db_host="localhost"
# db_user="root"

# db_db="Coal"
# db_user_table="users"

class MySQL:
    def __init__(self):
        self.conn = None
        self.curr = None
        self.config = {
            "host": db_host,
            "user": db_user,
            "password": db_pass,
            "database": db_db
        }

    def connect(self):
        try:
            self.conn = mysql.connector.connect(
                host=self.config["host"],
                user=self.config["user"],
                password=self.config["password"],
                database=self.config["database"]
            )
            self.curr = self.conn.cursor()
            print("Connected to database")
        except Exception as e:
            print("Error connecting to database: ", e)
    
    def select(self, query):
        return pd.read_sql(query, self.conn)
    
    def execute(self, query, values):
        self.curr.execute(query, values)

    def executemany(self, query, values):
        self.curr.executemany(query, values)

    def commit(self):
        result = self.curr.fetchone()
        if result:
            print(result)
        self.conn.commit()

    def close(self, commit=False):
        if commit:
            self.commit()
        self.curr.close()
        self.conn.close()
    