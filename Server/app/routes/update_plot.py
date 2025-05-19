from app.functions.first_product import first_product
from app.functions.second_product import second_product
from app.functions.final_tailings import final_tailings

def sort_plot_data(data):
    combined = list(zip(*data.values()))
    # Get keys in original order
    keys = list(data.keys())
    # Find index of 'A' column
    sort_index = keys.index('A')
    # Sort by A
    sorted_combined = sorted(combined, key=lambda x: x[sort_index])
    # Unzip back to dict of lists
    sorted_data = {k: [row[i] for row in sorted_combined] for i, k in enumerate(keys)}
    return sorted_data

def update_plot(req):
    print(req)
    plot_data = sort_plot_data(req['data']['data'])
    print(req['products'])

    coal_products = req['products']
    product_plots = []
    sgs = []
    clean_yeilds = []
    table_data = []
    options = []
    product_ranges = [{'max': sorted(set(plot_data['H']), reverse=True)[1], 'min': min(plot_data['H'])}]
    for index, product in enumerate(coal_products):
        options.append({'value': index, 'label': product['name']})
        if index == 0:
            # First Coal Product
            traces, sg, clean_yeild, next_product_range = first_product(product['ash'], plot_data)
            product_ranges.append(next_product_range)
            sgs.append(sg)
            clean_yeilds.append(clean_yeild)
            product_plots.append(traces)
            table_row = {
                'key': index+1,
                'product': product['name'],
                'ash': f"{product['ash']:.4f}",
                'sg': f"{sg:.4f}",
                'yeild': f"{clean_yeild:.4f}"
            }
            table_data.append(table_row)
        if index == 1:
            # Other Coal Products
            traces, sg, clean_yeild = second_product(product['ash'], plot_data, clean_yeild)
            product_ranges.append({'max': 100, 'min': 0})
            sgs.append(sg)
            clean_yeilds.append(clean_yeild)
            product_plots.append(traces)
            table_row = {
                'key': index+1,
                'product': product['name'],
                'ash': f"{product['ash']:.4f}",
                'sg': f"{sg:.4f}",
                'yeild': f"{clean_yeild:.4f}"
            }
            table_data.append(table_row)
    if len(coal_products) > 0:
        traces, ash, yeild = final_tailings(plot_data, sg)
        options.append({'value': index+1, 'label': 'Final Tailings'})
        product_plots.append(traces)
        product_ranges.append({'max': 100, 'min': 0})
        sgs.append(0)
        clean_yeilds.append(0)
        table_row = {
            'key': index+2,
            'product': 'Final Tailings',
            'ash': f"{ash:.4f}",
            'sg': f"{sg:.4f}",
            'yeild': f"{yeild:.4f}"
        }
        table_data.append(table_row)
        

    res = {
        'data': plot_data,
        'products': product_plots,
        'sg': sgs,
        'clean_yeild': clean_yeilds,
        'table_data': table_data,
        'options': options,
        'product_ranges': product_ranges
    }
    return res