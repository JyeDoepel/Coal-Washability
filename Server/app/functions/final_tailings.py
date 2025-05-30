import pandas as pd
import numpy as np

def final_tailings(data, sg):
    data = pd.DataFrame(data)
    og_data = data.copy()

    if data[data['A'] == sg].shape[0] > 0:
        new_row_index = data[data['A'] == sg].index[0]
        remove_row = False
    else:
        new_rows = pd.DataFrame({'A': [sg]})
        data = pd.concat([data, new_rows], ignore_index=True)
        data = data.sort_values(by='A')
        data = data.reset_index(drop=True)
        new_row_index = data[data['B'].isna()].index[0]
        if new_row_index > 0:
            percent_increase = (data['A'][new_row_index] - data['A'][new_row_index-1]) / (data['A'][new_row_index+1] - data['A'][new_row_index-1])
            for col in ['D', 'J', 'K']:
                if data[col][new_row_index+1] == 'None':
                    data[col][new_row_index] = 100
                data[col][new_row_index] = (data[col][new_row_index+1] - data[col][new_row_index-1]) * percent_increase + data[col][new_row_index-1]
    
    styles = {
        'type': 'scatter',
        'mode': 'lines',
        'xaxis': 'x2',
        'yaxis': 'y1',
        'name': 'First Coal Product',
        'line': {
          'dash': 'dash',
          'color': 'red',
          'width': 3,
        },
        'showlegend': False
    }

    sg_range = (2.7) - (data['A'].min() - 0.1)
    sg_as_ash = (np.float64(2.7)-sg)/sg_range*100

    traces = [
        {
            'x': [sg, sg], 
            'y': [0, np.float64(data['D'][new_row_index])]
        },
        {
            'x': [sg_as_ash, data['K'][new_row_index]],
            'y': [np.float64(data['D'][new_row_index]), np.float64(data['D'][new_row_index])]
        },
        {
            'x': [data['K'][new_row_index], data['K'][new_row_index]], 
            'y': [np.float64(data['D'][new_row_index]), 100]   
        }
    ]

    for index, trace in enumerate(traces):
        trace.update(styles)
        if index == 0:
            trace['xaxis'] = 'x1'
    return traces, data['K'][new_row_index], 100-np.float64(data['D'][new_row_index])



