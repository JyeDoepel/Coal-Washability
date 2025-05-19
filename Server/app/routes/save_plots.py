import pandas as pd
import os
from dotenv import load_dotenv
from fastapi import HTTPException
import json

from app.routes.authenticate import verify_token
from app.db.db import MySQL
from app.routes.update_plot import update_plot
from app.functions.process_data import process_data

load_dotenv()
db_plots_table = os.getenv("db_plots_table")

def save_plot(req, token):

    try:
        valid_token = verify_token(token)
    except:
        return verify_token(token)

    mysql = MySQL()
    mysql.connect()

    name = req['name']
    del req['name']

    sql = f"""
        INSERT INTO {db_plots_table} (id_user, name, data)
        VALUES (%s, %s, %s)
    """

    values = (int(valid_token['id']), name, json.dumps(req))

    try:
        mysql.execute(sql, values)
        mysql.close(commit=True)
    except Exception as e:
        mysql.close(commit=False)
        raise HTTPException(status_code=400, detail="Error saving plot")
    
    return {"message": "Plot saved successfully"}

def saved_plots(token):
    try:
        valid_token = verify_token(token)
    except:
        return verify_token(token)
    sql = f"""
        SELECT *
        FROM {db_plots_table}
        WHERE id_user = '{valid_token['id']}'
    """
    mysql = MySQL()
    mysql.connect()
    user_df = mysql.select(sql)
    mysql.close()
    return user_df.to_dict(orient='records')

def get_saved_plot(req, token):
    id_plot = req['id']
    sql = f"""
        SELECT *
        FROM {db_plots_table}
        WHERE id = {id_plot}
    """
    mysql = MySQL()
    mysql.connect()
    user_df = mysql.select(sql)
    print(user_df)
    if user_df['id_user'][0] != -1:
        try:
            valid_token = verify_token(token)
        except:
            return verify_token(token)
        if user_df['id_user'][0] != int(valid_token['id']):
            raise HTTPException(status_code=400, detail="Plot not found")

    if user_df.empty:
        raise HTTPException(status_code=400, detail="Plot not found")
    
    req_data = json.loads(user_df['data'].values[0])

    original_data_json = req_data['data']

    original_data = pd.DataFrame(req_data['data']) 

    req_data['original_data'] = req_data['data']

    data = process_data(original_data)

    req_data['data'] = data.to_dict(orient="list")

    update_dataset = {}
    update_dataset['data'] = req_data
    update_dataset['products'] = req_data['products']

    data = update_plot(update_dataset)

    res = {
        'data': data,
        'products': req_data['products'],
        'original_data': original_data_json,
    }

    return res

def example_plots():
    sql = f"""
        SELECT *
        FROM {db_plots_table}
        WHERE id_user = '-1'
    """
    mysql = MySQL()
    mysql.connect()
    user_df = mysql.select(sql)
    mysql.close()
    return user_df.to_dict(orient='records')

def delete_saved_plot(req, token):
    try:
        valid_token = verify_token(token)
    except:
        return verify_token(token)
    id_plot = req['id']

    sql = f"""
        DELETE
        FROM {db_plots_table}
        WHERE id = %s AND id_user = %s
    """
    mysql = MySQL()
    mysql.connect()
    mysql.execute(sql, (int(id_plot), int(valid_token['id'])))
    mysql.close(commit=True)
    return {"message": "Plot deleted successfully"}