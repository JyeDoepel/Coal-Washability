import pandas as pd
import numpy as np

def second_product(ash, data, previous_clean_yeild):
    data = pd.DataFrame(data)
    og_data = data.copy()
    remove_row = True
    if data[data['M'] == previous_clean_yeild].shape[0] > 0:
        new_row_index = data[data['M'] == previous_clean_yeild].index[0]
        remove_row = False
    else:
        new_rows = pd.DataFrame({'M': [previous_clean_yeild]})
        data = pd.concat([data, new_rows], ignore_index=True)
        data = data.sort_values(by='M')
        data = data.reset_index(drop=True)
        new_row_index = data[data['A'].isna()].index[0]
        if new_row_index > 0:
            percent_increase = (data['M'][new_row_index] - data['M'][new_row_index-1]) / (data['M'][new_row_index+1] - data['M'][new_row_index-1])
            for col in ['E']:
                data[col][new_row_index] = (data[col][new_row_index+1] - data[col][new_row_index-1]) * percent_increase + data[col][new_row_index-1]

    ash_at_previous_clean_yeild = data['E'][new_row_index]

    required_ash = 2*ash - ash_at_previous_clean_yeild
    sg_range = (2.7) - (data['A'].min() - 0.1)

    data = og_data.copy()

    if data[data['E'] == required_ash].shape[0] > 0:
        new_row_index = data[data['E'] == required_ash].index[0]
        remove_row = False
    else:
        new_rows = pd.DataFrame({'E': [required_ash]})
        data = pd.concat([data, new_rows], ignore_index=True)
        data = data.sort_values(by='E')
        data = data.reset_index(drop=True)
        new_row_index = data[data['A'].isna()].index[0]
        if new_row_index > 0:
            percent_increase = (data['E'][new_row_index] - data['E'][new_row_index-1]) / (data['E'][new_row_index+1] - data['E'][new_row_index-1])
            for col in ['M']:
                data[col][new_row_index] = (data[col][new_row_index+1] - data[col][new_row_index-1]) * percent_increase + data[col][new_row_index-1]

    
    clean_yeild = data['M'][new_row_index]

    data = og_data.copy()

    if data[data['D'] == clean_yeild].shape[0] > 0:
        new_row_index = data[data['D'] == clean_yeild].index[0]
        remove_row = False
    else:
        new_rows = pd.DataFrame({'D': [clean_yeild]})
        data = pd.concat([data, new_rows], ignore_index=True)
        data = data.sort_values(by='D')
        data = data.reset_index(drop=True)
        new_row_index = data[data['A'].isna()].index[0]
        if new_row_index > 0:
            percent_increase = (data['D'][new_row_index] - data['D'][new_row_index-1]) / (data['D'][new_row_index+1] - data['D'][new_row_index-1])
            for col in ['A']:
                data[col][new_row_index] = (data[col][new_row_index+1] - data[col][new_row_index-1]) * percent_increase + data[col][new_row_index-1]
    
    sg = data['A'][new_row_index]
    a_val = np.float64(data['A'][new_row_index])
    a_val = (np.float64(2.7)-a_val)/sg_range*100

    data = og_data.copy()

    if data[data['M'] == clean_yeild].shape[0] > 0:
        new_row_index = data[data['M'] == clean_yeild].index[0]
        remove_row = False
    else:
        new_rows = pd.DataFrame({'M': [clean_yeild]})
        data = pd.concat([data, new_rows], ignore_index=True)
        data = data.sort_values(by='M')
        data = data.reset_index(drop=True)
        new_row_index = data[data['A'].isna()].index[0]
        if new_row_index > 0:
            percent_increase = (data['M'][new_row_index] - data['M'][new_row_index-1]) / (data['M'][new_row_index+1] - data['M'][new_row_index-1])
            for col in ['E']:
                data[col][new_row_index] = (data[col][new_row_index+1] - data[col][new_row_index-1]) * percent_increase + data[col][new_row_index-1]

    e_val = np.float64(data['E'][new_row_index])

    styles = {
        'type': 'scatter',
        'mode': 'lines',
        'name': '',
        'line': {
          'dash': 'dash',
          'color': 'red',
          'width': 3,
        },
        'showlegend': False
    }
    
    traces = [
        {
            'x': [0, ash_at_previous_clean_yeild],
            'y': [previous_clean_yeild, previous_clean_yeild],
            'xaxis': 'x2',
            'yaxis': 'y1',
        },
        {
            'x': [ash_at_previous_clean_yeild, ash_at_previous_clean_yeild],
            'y': [previous_clean_yeild, 100],
            'xaxis': 'x2',
            'yaxis': 'y1',
        },
        {
            'x': [required_ash, required_ash],
            'y': [100, clean_yeild],
            'xaxis': 'x2',
            'yaxis': 'y1',
        },
        {
            'x': [0, e_val if e_val > a_val else a_val],
            'y': [clean_yeild, clean_yeild],
            'xaxis': 'x2',
            'yaxis': 'y1',
        },
        {
            'x': [sg, sg],
            'y': [clean_yeild, 0],
            'xaxis': 'x1',
            'yaxis': 'y1',
        }
    ]

    for index, trace in enumerate(traces):
        trace.update(styles)

    clean_yeild = clean_yeild - previous_clean_yeild

    return traces, sg, clean_yeild