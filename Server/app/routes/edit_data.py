import pandas as pd

from app.functions.process_data import process_data
from app.routes.data_upload import original_data

def edit_data(req):
    df_original = pd.DataFrame(req)
    df_original = df_original.drop(columns=['index'])
    df_original.sort_values(by='A', inplace=True)
    df_original.reset_index(drop=True, inplace=True)
    df = process_data(df_original)

    df_original = original_data(df_original)
    res = {
        'data': df.to_dict(orient="list"),
        'product_ranges': [{'max': max(df['H']), 'min': min(df['H'])}],
        'original_data': df_original.to_dict(orient="records")
    }
    return res