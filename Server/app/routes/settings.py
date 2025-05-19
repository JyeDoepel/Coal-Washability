from fastapi import HTTPException
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
import re
import jwt
import datetime

from app.db.db import MySQL
from app.routes.authenticate import verify_token
from app.routes.account import create_jwt_token, hash_password, is_password_strong

load_dotenv()
users_table = os.getenv("db_user_table")
db_plots_table = os.getenv("db_plots_table")

def change_username(req, token):
    try:
        valid_token = verify_token(token)
    except:
        return verify_token(token)
    
    old_username = valid_token['sub']
    
    sql = f"""
        SELECT *
        FROM {users_table}
        WHERE username = '{old_username}'
    """
    mysql = MySQL()
    mysql.connect()
    old_user_df = mysql.select(sql)
    if old_user_df.empty:
        raise HTTPException(status_code=500, detail="Syncronization error")
    
    id = old_user_df['id'].values[0]
    
    sql = f"""
        UPDATE {users_table}
        SET username = %s
        WHERE id = %s
    """
    mysql = MySQL()
    mysql.connect()
    values = (req['username'], int(id))

    try:
        mysql.execute(sql, values)
        mysql.close(commit=True)
    except Exception as e:
        mysql.close(commit=False)
        raise HTTPException(status_code=400, detail="Username already exists")
    
    token = create_jwt_token(req['username'], id)
    return {"access_token": token, "token_type": "bearer"}

def change_password(req, token):
    try:
        valid_token = verify_token(token)
    except:
        return verify_token(token)
    
    username = valid_token['sub']

    sql = f"""
        SELECT *
        FROM {users_table}
        WHERE username = '{username}'
    """
    mysql = MySQL()
    mysql.connect()
    old_user_df = mysql.select(sql)
    if old_user_df.empty:
        raise HTTPException(status_code=500, detail="Syncronization error")
    
    password = hash_password(req['password'])
    if not is_password_strong(req['password']):
        raise HTTPException(status_code=400, detail="Password does not meet complexity requirements")
    
    sql = f"""
        UPDATE {users_table}
        SET password_hash = %s
        WHERE username = %s
    """

    values = (password, username)
    try:
        mysql.execute(sql, values)
        mysql.close(commit=True)
    except Exception as e:
        mysql.close(commit=False)
        raise HTTPException(status_code=500, detail="Internal server error")
    
    return {"message": "Password changed successfully"}

def delete_account(token):
    try:
        valid_token = verify_token(token)
    except:
        return verify_token(token)
    
    id = valid_token['id']

    sql = f"""
        DELETE FROM {users_table}
        WHERE id = %s
    """
    values = (int(id),)
    mysql = MySQL()
    mysql.connect()
    try:
        mysql.execute(sql, values)
    except Exception as e:
        mysql.close(commit=False)
        raise HTTPException(status_code=500, detail="Internal server error")
    
    sql = f"""
        DELETE FROM {db_plots_table}
        WHERE id_user = %s
    """
    try:
        mysql.execute(sql, values)
    except Exception as e:
        mysql.close(commit=False)
        raise HTTPException(status_code=500, detail="Internal server error")

    mysql.close(commit=True)
    
    return {"message": "Account deleted successfully"}