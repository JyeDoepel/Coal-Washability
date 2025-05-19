from fastapi import HTTPException
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
import re
import jwt
import datetime

from app.db.db import MySQL

load_dotenv()
users_table = os.getenv("db_user_table")
SECRET_KEY = os.getenv("SECRET_KEY")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_jwt_token(username: str, id: int):
    payload = {
        "sub": username,
        "exp": datetime.datetime.now() + datetime.timedelta(hours=1),
        "id": int(id)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def is_password_strong(password: str) -> bool:
    """Enforce ISO 27001 password complexity rules."""
    if len(password) < 12:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'[0-9]', password):
        return False
    if not re.search(r'[!@#$%^&*]', password):
        return False
    return True

def hash_password(password: str):
    return pwd_context.hash(password)

def signup(req):
    mysql = MySQL()
    username = req['username']
    password = hash_password(req['password'])
    if not is_password_strong(req['password']):
        raise HTTPException(status_code=400, detail="Password does not meet complexity requirements")
    mysql.connect()
    query = f"""
    INSERT INTO {users_table} (username, password_hash) VALUES (%s, %s)
    """
    values = (username, password)
    try:
        mysql.execute(query, values)
    except Exception as e:
        mysql.close()
        raise HTTPException(status_code=400, detail="Username already exists")
    mysql.commit()
    mysql.close()
    return {"message": "User signed up successfully"}

def signin(req):
    username = req['username']
    password = req['password']
    mysql = MySQL()
    sql = f"""
    SELECT * FROM {users_table} WHERE username = '{username}'
    """
    mysql.connect()
    result = mysql.select(sql)

    if len(result) == 0 or not verify_password(password, result["password_hash"][0]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    id = result["id"][0]
    token = create_jwt_token(username, id)

    mysql.close()
    return {"access_token": token, "token_type": "bearer"}

