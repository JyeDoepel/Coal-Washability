import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings("ignore", category=pd.errors.SettingWithCopyWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

def process_data(data):
    if 'Density of Separation' in data.columns:
        data = data.rename(columns={'Density of Separation': 'A', 'Weight %': 'B', 'Fraction Ash %': 'E'})
        data = data[['A', 'B', 'E']]

    data = data.sort_values(by='A', ascending=True)

    data['C'] = np.nan
    data['C'] = (data['B'] / data['B'].sum()) * 100
    data['D'] = data['C'].cumsum()
    data['F'] = data['C'] * data['E'] / 100
    data['G'] = data['F'].cumsum()
    data['H'] = [
        (g / d * 100) if d != 0 else 0
        for g, d in zip(data['G'], data['D'])
    ]
    data['I'] = data['F'].sum() - data['G']
    data['J'] = 100 - data['D']
    data['K'] = data['I'] / data['J'] * 100
    data['M'] = None
    for i, _ in data.iterrows():
        if i == 0:
            data['M'][i] = data['C'][i] / 2
        else:
            data['M'][i] = data['D'][i-1] + data['C'][i] / 2

    data = data.fillna("None")
    return data
