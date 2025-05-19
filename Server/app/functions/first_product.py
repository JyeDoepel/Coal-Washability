import numpy as np
import pandas as pd

def first_product(ash, data):
    data = pd.DataFrame(data)
    og_data = data.copy()


    data.replace(-np.inf, None, inplace=True)
    remove_row = True
    if data[data['H'] == ash].shape[0] > 0:
        new_row_index = data[data['H'] == ash].index[0]
        remove_row = False
    else:
        new_rows = pd.DataFrame({'H': [ash]})
        data = pd.concat([data, new_rows], ignore_index=True)
        data = data.sort_values(by='H')
        data = data.reset_index(drop=True)
        new_row_index = data[data['A'].isna()].index[0]
        if new_row_index > 0:
            percent_increase = (data['H'][new_row_index] - data['H'][new_row_index-1]) / (data['H'][new_row_index+1] - data['H'][new_row_index-1])
            for col in ['A', 'D']:
                data[col][new_row_index] = (data[col][new_row_index+1] - data[col][new_row_index-1]) * percent_increase + data[col][new_row_index-1]

    

    sg_range = (2.7) - (data['A'].min() - 0.1)
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

    traces = [
        {
            'x': [ash, ash], 
            'y': [100, np.float64(data['D'][new_row_index])]
        },
        {
            'x': [np.float64(data['A'][new_row_index]), np.float64(data['A'][new_row_index])], 
            'y': [np.float64(data['D'][new_row_index]), 0]
        },
        {
            'x': [0, np.float64(data['H'][new_row_index]) if np.float64(data['H'][new_row_index]) > (np.float64(2.7)-np.float64(data['A'][new_row_index]))/sg_range*100 else (np.float64(2.7)-np.float64(data['A'][new_row_index]))/sg_range*100], 
            'y': [np.float64(data['D'][new_row_index]), np.float64(data['D'][new_row_index])]
        }
    ]

    for index, trace in enumerate(traces):
        trace.update(styles)
        if index == 1:
            trace['xaxis'] = 'x1'
    sg = np.float64(data['A'][new_row_index])
    clean_yeild = np.float64(data['D'][new_row_index])

    if remove_row:
        data = data.drop(index=new_row_index)
        data = data.reset_index(drop=True)

    data = og_data.copy()

    data.replace(-np.inf, None, inplace=True)
    remove_row = True
    if data[data['M'] == clean_yeild].shape[0] > 0:
        new_row_index = data[data['M'] == clean_yeild].index[0]
        remove_row = False
    else:
        new_rows = pd.DataFrame({'M': [clean_yeild]})
        data = pd.concat([data, new_rows], ignore_index=True)
        data = data.sort_values(by='M')
        data = data.reset_index(drop=True)
        new_row_index = data[data['A'].isna()].index[0]
    try:
        if new_row_index > 0:
            percent_increase = (data['M'][new_row_index] - data['M'][new_row_index-1]) / (data['M'][new_row_index+1] - data['M'][new_row_index-1])
            for col in ['E']:
                data[col][new_row_index] = (data[col][new_row_index+1] - data[col][new_row_index-1]) * percent_increase + data[col][new_row_index-1]

        min_ash_of_next_product = np.float64(data['E'][new_row_index])
        data = og_data.copy()
        new_rows = pd.DataFrame({'M': [data['D'].nlargest(2).iloc[-1]]})
        data = pd.concat([data, new_rows], ignore_index=True)
        data = data.sort_values(by='M')
        data = data.reset_index(drop=True)
        new_row_index = data[data['A'].isna()].index[0]
        percent_increase = (data['M'][new_row_index] - data['M'][new_row_index-1]) / (data['M'][new_row_index+1] - data['M'][new_row_index-1])
        for col in ['E']:
            data[col][new_row_index] = (data[col][new_row_index+1] - data[col][new_row_index-1]) * percent_increase + data[col][new_row_index-1]


        max_ash = 100-(data['A'].nlargest(2).iloc[-1] - (data['A'].min() - 0.1))/sg_range*100 
        print(max_ash)
        max_ash_of_next_product = (min_ash_of_next_product + data['E'][new_row_index])/2
        print(data)
        

        next_product_range = {'max': max_ash_of_next_product, 'min': min_ash_of_next_product}
    except:
        next_product_range = None

    return traces, sg, clean_yeild, next_product_range