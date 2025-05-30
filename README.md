# Coal Washability Application
Available at http://coalwashability.com:3000/

## React Application
### Running application on your local machine:
```
cd /Client/app
touch .env
```
Within the `.env` file, assigin your local FastAPI url to the `VITE_APP_API_URL` variable.
Similar to:
```
VITE_APP_API_URL=http://localhost:8000
```
Run the following commands:
```
npm install
npm run dev
```
## FastAPI Application
### Running application on your local machine:
```
cd /Server
touch .env
```
Within the `.env` file, assigin your local MySQL Server IP address to the `db_host` variable, add your database credentials to the db_user and db_pass variables. Add your database name to the db_db variable, aswell as you table names to the db_users_table and db_plots_table vaiables. Add your cryptography secret key to the SECTET_KEY variable.
Similar to:
```
db_host="localhost"
db_user="You"
db_pass="Your_Password"
db_db="Your_Database_Name"
db_users_table="Your_Users_Table"
db_plots_table="Your_Plots_Table"
SECRET_KEY="Your_Random_Secret_Key"
```
Run the following commands:
```
pip install -r app/requirements.txt
uvicorn app.app:app --host 0.0.0.0 --port 8000 --reload
```
## MySQL Server Database Configuration
Run the following SQL commands within your MySQL Server to configure the database for the application.
```
CREATE DATABASE Your_Database_Name;

CREATE TABLE Your_Database_Name.Your_Plots_Table (
    id INT NOT NULL AUTO_INCREMENT,
    id_user INT,
    name VARCHAR(255),
    data LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE Your_Database_Name.Your_Users_Table (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```
