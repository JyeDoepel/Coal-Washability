import pandas as pd
from io import StringIO
from fastapi import HTTPException

from app.functions.process_data import process_data

def original_data(data):
    if 'Density of Separation' in data.columns:
        data = data.rename(columns={'Density of Separation': 'A', 'Weight %': 'B', 'Fraction Ash %': 'E'})
        data = data[['A', 'B', 'E']]
    data = data.fillna("None")
    data.reset_index(inplace=True)
    return data

def data_upload(file):
    filename = file.filename.lower()
    contents = file.file.read()
    try:
        if filename.endswith(".csv"):
            df_original = pd.read_csv(StringIO(contents.decode('utf-8')))
        elif filename.endswith(".json"):
            df_original = pd.read_json(StringIO(contents.decode('utf-8')))
        else:
            raise HTTPException(status_code=400, detail="Only CSV or JSON files are supported.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

    df = process_data(df_original)
    df_original = original_data(df_original)
    print(df['H'].nlargest(2).iloc[-1])
    res = {
        'data': df.to_dict(orient="list"),
        'product_ranges': [{'max': df['H'].nlargest(2).iloc[-1], 'min': min(df['H'])}],
        'original_data': df_original.to_dict(orient="records")
    }
    return res