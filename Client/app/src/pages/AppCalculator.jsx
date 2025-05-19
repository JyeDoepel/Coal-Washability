import { Card, Input, InputNumber, Button, Upload, message, Table, Select, Drawer } from "antd";
// import Plot from 'react-plotly.js';
// import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist';
const Plot = createPlotlyComponent(Plotly);
import { useEffect, useState, useRef } from "react";
import { CloseOutlined, UploadOutlined, EditOutlined, LineChartOutlined, InfoCircleOutlined, MenuUnfoldOutlined, DeleteOutlined } from "@ant-design/icons"; // Ant Design delete icon

import "../index.css";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const table_columns = [
  {
    title: 'Coal Product',
    dataIndex: 'product',
    key: 'product',
  },
  {
    title: 'Ash %',
    dataIndex: 'ash',
    key: 'ash',
    render: (text, record) => (
      <p>{Number(text).toFixed(2)}</p>
    )
  },
  {
    title: 'Yeild %',
    dataIndex: 'yeild',
    key: 'yeild',
    render: (text, record) => (
      <p>{Number(text).toFixed(2)}</p>
    )
  },
  {
    title: 'Density of Separation Required',
    dataIndex: 'sg',
    key: 'sg',
    render: (text, record) => (
      <p>{Number(text).toFixed(2)}</p>
    )
  },
];

function AppCalculator({ ip, token }) {
  const [user, set_user] = useState(null);
  const [plot_name, set_plot_name] = useState('');
  const [saved_plots, set_saved_plots] = useState([]);
  const [example_plots, set_example_plots] = useState([]);
  const [uploaded_data, set_uploaded_data] = useState([]);
  const [data_error_messages, set_data_error_messages] = useState([]);
  const [coalProducts, setCoalProducts] = useState([]);
  const [plotData, setplotData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [data_change, setdata_change] = useState(0);

  const [run_saved_plots, set_run_saved_plots] = useState(0);

  const [plotElement, setplotElement] = useState((
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
      <h2>Upload Your Data to Start Plotting</h2>
    </div>
  ));
  const [table_data, settable_data] = useState([]);
  const [selected_product, setselected_product] = useState(null);
  const [sankey_plot, set_sankey_plot] = useState('');

  const plotref = useRef(null);

  useEffect(() => {
    async function get_saved_plots() {
      const response = await fetch(`${ip}/saved_plots/${token}`);
      const data = await response.json();
      set_saved_plots(data);
      console.log(data);
      set_plot_name(`Unnamed Plot ${data.length + 1}`); 
    }

    async function get_example_plots() {
      const response = await fetch(`${ip}/example_plots`);
      const data = await response.json();
      set_example_plots(data);
      console.log(data);
    }

    if (user !== null && token !== null) {
      get_saved_plots();
    }
    get_example_plots();

  }, [user, run_saved_plots, token]);


  useEffect(() => {
      let isMounted = true;
      async function fetchData() {
      const response = await fetch(`${ip}/authenticate/${token}`);
      const data = await response.json();
      console.log(data);
      if (response.status == 200) {
          if (isMounted) {
              set_user(data.sub); // Only update if component is still mounted
          }
      }
      else {
          if (isMounted) {
            set_user(null);
          }
      }
      }
      if (token !== null) {
          fetchData();
      } else {
          set_user(null);
      }
      
      return () => { isMounted = false; };
  }, [token]);


  const edit_edit_table_columns = (key, field, value) => {
    set_uploaded_data((prev) => {
      const newData = [...prev];
      const index = newData.findIndex((item) => item.index === key);
      if (index !== -1) {
        newData[index] = { ...newData[index], [field]: value };
      }
      return newData;
    });
  };

  const edit_table_columns = [
    {
      title: 'Density of Separation',
      dataIndex: 'A',
      key: 'A',
      render: (text, record) => (
        <InputNumber
              onChange={(e) => edit_edit_table_columns(record.index, "A", e)}
              step={0.1}
              style={{ width: '50%' }}
              value={record.A}
            />
      )
    },
    {
      title: 'Weight %',
      dataIndex: 'B',
      key: 'B',
      render: (text, record) => (
        <InputNumber
              onChange={(e) => edit_edit_table_columns(record.index, "B", e)}
              style={{ width: '50%' }}
              value={record.B}
            />
      )
    },
    {
      title: 'Fraction Ash %',
      dataIndex: 'E',
      key: 'E',
      render: (text, record) => (
        <InputNumber
              onChange={(e) => edit_edit_table_columns(record.index, "E", e)}
              style={{ width: '50%' }}
              value={record.E}
            />
      )
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Button 
          type="text" 
          danger 
          icon={<CloseOutlined />} 
          onClick={() => deleteRowFromUploadedData(record.index)} 
        />
      )
    }
  ];

  function createPlotElement(input_data) {

    var product_traces = input_data['products'] ?? [];


    var plot_data = [
        {
          x: input_data['data']['A'].slice(0, -1),
          y: input_data['data']['D'].slice(0, -1),
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'blue' },
          name: 'The Densimetric Curve',
          legendgroup: 'densimetric_curve',
          xaxis: 'x1',
          yaxis: 'y1',
        },
        {
          x: input_data['data']['H'],
          y: input_data['data']['D'],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'orange' },
          name: 'The Cumulative Floats Curve',
          xaxis: 'x2',
          yaxis: 'y1',
        },
        {
          x: input_data['data']['K'],
          y: input_data['data']['J'],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'green' },
          name: 'The Cumulative Sinks Curve',
          xaxis: 'x2',
          yaxis: 'y2',
        },
        {
          x: input_data['data']['E'],
          y: input_data['data']['M'],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'purple' },
          name: 'The Instantaneous Ash Curve',
          xaxis: 'x2',
          yaxis: 'y1',
        },
        {
          x: [Math.max(...input_data['data']['A'].slice(0, -1)), 2.6],
          y: [Math.max(...input_data['data']['D'].slice(0, -1)), 100],
          type: 'scatter',
          mode: 'lines', // Ensure the mode is set to 'lines'
          line: {
            dash: 'dot',  // 'dot' creates a dotted line
            width: 2,
            color: 'blue',
          },
          marker: { color: 'blue' },
          name: 'The Densimetric Curve',
          legendgroup: 'densimetric_curve',
          showlegend: false,
          xaxis: 'x1',
          yaxis: 'y1',
        },
        {
          x: [Math.max(...input_data['data']['A'].slice(0, -1)), 2.4],
          y: [Math.max(...input_data['data']['D'].slice(0, -1)), 100],
          type: 'scatter',
          mode: 'lines', // Ensure the mode is set to 'lines'
          line: {
            dash: 'dot',  // 'dot' creates a dotted line
            width: 2,
            color: 'blue',
          },
          marker: { color: 'blue' },
          showlegend: false,
          name: 'The Densimetric Curve',
          legendgroup: 'densimetric_curve',
          xaxis: 'x1',
          yaxis: 'y1',
        }
    ];

    plot_data = plot_data.concat(product_traces[selected_product] ?? []);

    return (
        <Plot
          ref={plotref}
          data={plot_data}
          layout={{
            xaxis1: { range: [2.7, Math.min(...input_data['data']['A'])-0.1], title: {text: 'SPECIFIC GRAVITY', standoff: 0}, side:'top', showgrid: false, // ✅ Remove grid lines
            zeroline: false,
            showline: false,},
            yaxis1: { range: [100, 0], title: {text: 'CUMULATIVE WEIGHT % FLOATS', standoff: 0}, showgrid: false, // ✅ Remove grid lines
            zeroline: false,
            showline: false,},
            xaxis2: {range: [0, 100], side: 'bottom', title: {text: 'ASH %', standoff: 0}, overlaying: 'x', showgrid: false, // ✅ Remove grid lines
            zeroline: false,
            showline: false,},
            yaxis2: {range: [0, 100], side: 'right', title: {text: 'CUMULATIVE WEIGHT % SINKS', standoff: 0}, overlaying: 'y', showgrid: false, // ✅ Remove grid lines
            zeroline: false,
            showline: false,},
            margin: { l: 60, r: 30, t: 30, b: 60 }, // Remove all margins
            paper_bgcolor: "rgba(0,0,0,0)", // Transparent background
            plot_bgcolor: "rgba(0,0,0,0)",
            legend: {
              orientation: 'h', // Horizontal legend
              x: 0, // Aligns legend to the left
              y: -0.2, // Moves legend below the plot (negative values)
            }
          }}
          config={{
            responsive: true,
            displayModeBar: false
          }}
          style={{ width: '100%', height: '600px' }}
        />
      );
  }

  function download_plot_image() {
    if (plotref.current) {
      Plotly.toImage(plotref.current.el, {
        format: 'png',
        width: 800,
        height: 600,
      })
        .then(function (dataUrl) {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'plot.png';
          link.click();
        });
    }

  }

  const props = {
    name: 'file',
    action: `${ip}/data_upload`,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        setCoalProducts([]);
        setselected_product(null);
        settable_data([]);
        setplotData(info.file.response);
        set_uploaded_data(info.file.response.original_data);
        console.log(info.file.response.original_data);
        set_data_error_messages([]);
        setEditing(true);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  useEffect(() => {
    if (plotData !== null) {
      setplotElement(createPlotElement(plotData));
    }
  }, [plotData, selected_product]);

  useEffect(() => {
    if (table_data.length > 0) {
      set_sankey_plot(sankey_data(table_data));
    } else {
      set_sankey_plot('');
    }
  }, [table_data]);

  useEffect(() => {
    async function updatePlot() {
      console.log(plotData);
      const req = {
        'data': plotData,
        'products': coalProducts,
      }
      const response = await fetch(`${ip}/update_plot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });
      const data = await response.json();
      console.log(data);
      setplotData(data);
      settable_data(data['table_data']);
    }
    if (plotData !== null) {
      updatePlot();
    }
  }, [coalProducts]);

  useEffect(() => {
    async function updatePlot() {
      const response = await fetch(`${ip}/edit_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploaded_data),
      });
      const data = await response.json();
      console.log(data);
      setplotData(data);
    }
    if (uploaded_data.length > 0) {
      updatePlot();
    }
  }, [data_change]);

  function addProduct() {
    if (selected_product === null) {
      setselected_product(0);
    } else {
      setselected_product(selected_product+1);
    }

    setCoalProducts((prevProducts) => [
      ...prevProducts,
      { edit_name: false, name: `Coal Product ${coalProducts.length+1}`, id: Date.now(), ash: getRandomInt(plotData['product_ranges'][coalProducts.length]['min'], plotData['product_ranges'][coalProducts.length]['max']) }, // Unique ID using timestamp
    ]);
    // setselected_product(coalProducts.length-1);
  }

  // Function to delete a product
  function deleteProduct(id) {
    if (selected_product === 0) {
      setselected_product(null);
    } else {
      setselected_product(selected_product-1);
    }
    setCoalProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  }

  function change_ash(value, index) {
    setCoalProducts((prevProducts) => {
      const newProducts = [...prevProducts];
      newProducts[index].ash = value;
      return newProducts;
    });
  }

  function data_validate() {
    let errors = [];
    console.log('validating');
    var sum = 0;
    for (var i = 0; i < uploaded_data.length; i++) {
      sum += uploaded_data[i].B;

      if (uploaded_data[i].B < 0 || uploaded_data[i].B > 100) {
        errors.push(`Weight % must be between 0 and 100.`);
      }
      if (uploaded_data[i].A < 0) {
        errors.push(`Density of Separation must be greater then 0.`);
      }
      if (uploaded_data[i].E < 0 || uploaded_data[i].E > 100) {
        errors.push(`Fraction Ash % must be between 0 and 100.`);
      }
    }
    if (sum !== 100) {
      errors.push('Sum of weight % must be 100.');
    }


    
    set_data_error_messages(errors);
    if (errors.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  function addRowToUploadedData() {
    const newIndex = uploaded_data.length > 0 ? Math.max(...uploaded_data.map(row => row.index ?? 0)) + 1 : 0;
  
    const newRow = {
      index: newIndex,
      A: 1,
      B: 0,
      E: 0,
    };
  
    set_uploaded_data(prev => [...prev, newRow]);
  }

  function deleteRowFromUploadedData(index) {
    set_uploaded_data(prev => prev.filter(row => row.index !== index));
  }

  function sankey_data(data) {
    const productLabels = data.map(d => d.product);
    const yieldValues = data.map(d => parseFloat(d.yeild));
    const ashValues = data.map(d => d.ash);
    const sgValues = data.map(d => d.sg);
    const nodeHoverText = productLabels.map((product, i) => {
      return `Product: ${product}<br>Yield: ${yieldValues[i]}%<br>Ash: ${ashValues[i]}%<br>SG: ${sgValues[i]}`;
    });
  
    // Sankey plot data
    const sankeyData = [
      {
        type: 'sankey',
        node: {
          pad: 15,
          thickness: 20,
          line: {
            color: 'black',
            width: 0.5
          },
          label: ['Raw Coal', ...productLabels],
          color: ['gray', 'blue', 'green', 'red'],
          hoverinfo: 'label+value+percent',  // Default hover info for nodes
          customdata: ['Raw Coal', ...nodeHoverText],  // Adding custom hover text for nodes
          hovertemplate: '%{customdata}<extra></extra>' // Display custom hover text for nodes
        },
        link: {
          source: Array(data.length).fill(0), // All flows originate from Raw Coal (node 0)
          target: Array.from({ length: data.length }, (_, i) => i + 1), // Target nodes are the products
          value: yieldValues, // Flow values corresponding to the yield percentages
          hovertemplate: '%{source.label} -> %{target.label}<br>Flow Value: %{value} <extra></extra>' // Hover info for links
        }
      }
    ];
    const layout = {
      title: 'Sankey Diagram for Coal Products',
      font: {
        size: 12
      },
      margin: { l: 0, r: 0, t: 0, b: 0 }, // Remove all margins
      // paper_bgcolor: "rgba(0,0,0,0)", // Transparent background
      plot_bgcolor: "rgba(0,0,0,0)",
    };
    return <Plot data={sankeyData} layout={layout} config={{responsive: true,displayModeBar: false}} style={{ width: '100%', height: '200px' }}/>;
  }

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    }
    const onClose = () => {
      setOpen(false);
    };

    async function save_plot() {
      const req = {
        data: uploaded_data,
        products: coalProducts,
        name: plot_name,
      }
      console.log(req);
      const response = await fetch(`${ip}/save_plot/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });
      if (response.status == 200) {
        const data = await response.json();

        message.success(data.message);
        set_run_saved_plots(run_saved_plots+1);
      } else {
        message.error(response.detail);
      }
    }

    async function select_saved_plot(plot) {
      const response = await fetch(`${ip}/get_saved_plot/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plot),
      });
      const data = await response.json();
      console.log(data);
      // setCoalProducts(data.products);
      set_uploaded_data(data.original_data); 
      console.log('this is it')
      console.log(data.original_data);
      setplotData(data.data);
      setCoalProducts(data.products);
      setselected_product(0);
      setOpen(false);
    }

    async function delete_saved_plot(plot) {
      const response = await fetch(`${ip}/delete_saved_plot/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plot),
      });
      if (response.status == 200) {
        const data = await response.json();
        message.success(data.message);
      } else {
        message.error(response.detail);
      }

      set_run_saved_plots(run_saved_plots+1);
    }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2%' }}>
        <Button type="primary" onClick={showDrawer} style={{height: '40px', marginTop: '-4%', marginRight: '5%'}}>
          <MenuUnfoldOutlined style={{fontSize: '20px'}}/>
        </Button>
      </div>

      <Drawer closable={{'aria-label': 'Close Button'}} placement="right" onClose={onClose} open={open} title={(
        <h2 style={{textAlign: 'right', margin: '0px'}}>Saved Curves</h2>
      )}>
          <div>
            
            {
          (user == null) ? <h2 style={{textAlign: 'center'}}>Please Sign In to Save Curves</h2> :
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px'}}>
                  <Input value={plot_name} onChange={(e) => set_plot_name(e.target.value)}/>
                  <Button disabled={uploaded_data.length == 0} type="primary" onClick={() => save_plot()}>Save Current Plot</Button>
                </div>
                 <h2>Saved Curves</h2>
                 {saved_plots.length == 0 ? <p style={{textAlign: 'center'}}>No Saved Curves Yet.</p> : ''}
                {saved_plots.map((plot) => (
                  <div onClick={() => select_saved_plot(plot)} className="saved_plot" style={{cursor: 'pointer',display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc'}}>
                    <LineChartOutlined style={{fontSize: '40px'}}/>
                    <p>{plot.name}</p>
                    <div textAlign="right" style={{marginLeft: 'auto'}}>
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined style={{fontSize: '20px'}}/>} 
                      onClick={(e) => {e.stopPropagation(); delete_saved_plot(plot)}} 
                    />
                    </div>
                  </div>
                ))}
              </div>
            }
            <h2>Examples</h2>
            <div>
              {example_plots.map((plot) => (
                <div onClick={() => select_saved_plot(plot)} className="saved_plot" style={{cursor: 'pointer',display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc'}}>
                  <LineChartOutlined style={{fontSize: '40px'}}/>
                  <p>{plot.name}</p>
                </div>
              ))}
            </div>
          </div>
        
      </Drawer>

      <div style={{ display: "flex", justifyContent: "center", gap: "2%" }}>
        <Card style={{ width: "60%" }} title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{margin: '10px 0'}}>
                <h2 style={{margin: '0'}}>Coal Washability Curve</h2>
                {(plotData?.options ?? []).length > 0 && (
                <Select 
                  options={plotData?.options ?? []}
                  style={{ width: '70%' }}
                  onChange={(value) => setselected_product(value)}
                  defaultValue={selected_product}
                  value={selected_product}
                />)}
              </div>
              
                {uploaded_data.length == 0 ?
                  <Upload {...props}>
                      <Button icon={<UploadOutlined />}>Upload Data</Button>
                  </Upload> :
                  <div style={{ display: "flex", gap: "5px" }}>
                  <Button icon={<LineChartOutlined />} onClick={() => download_plot_image()} style={{marginRight: '10px'}}>Save Plot</Button>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <Button
                      onClick={() => {
                        if (editing) {
                          if (data_validate()) {
                            set_uploaded_data(uploaded_data.sort((a, b) => a.A - b.A));
                            setdata_change(data_change+1);
                            console.log('This is it');
                            console.log(uploaded_data);
                            setEditing(!editing);
                          }
                        } else {
                          set_data_error_messages([]);
                          setEditing(!editing);
                        }
                        

                      }}
                      icon={ editing ? <LineChartOutlined /> : <EditOutlined /> }
                    >
                      { editing ? 'View Plot' : 'Edit Data' }
                    </Button>
                    <Button 
                      type="text" 
                      danger 
                      icon={<CloseOutlined />} 
                      onClick={() => {
                        set_uploaded_data([]);
                        setCoalProducts([]);
                        setplotData(null);
                        settable_data([]);
                        setselected_product(null);
                        setEditing(false);
                        setplotElement(
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
                            <h2>Upload Your Data to Start Plotting</h2>
                          </div>
                        )
                      }}
                    />

                  </div>
                  </div>
                }

            </div>
            }>
            { editing ? (
              <div>
                {data_error_messages.map((message) => (
                  <div style={{display: 'flex'}}>
                      <InfoCircleOutlined style={{color: 'red', marginRight: '10px'}}/>
                      <p style={{color: 'red'}}>{message}</p>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{margin: '0'}}><b>Weight Sum: {uploaded_data.reduce((accumulator, currentValue) => accumulator + currentValue.B, 0)}</b></p>
                  </div>
                  <Button type="primary" onClick={addRowToUploadedData} style={{ marginBottom: '10px', marginRight: '8.5px' }}>
                    Add New Row
                  </Button>
                </div>
                <Table columns={edit_table_columns} dataSource={uploaded_data}></Table>
              </div>
            ) : 
            plotElement
            }

        </Card>

        {/* Right Side Panel */}
        <div style={{ width: "30%" }}>
          <div>
            {coalProducts.map((product, index) => (
              <Card
              
                key={product.id}
                style={{ marginBottom: "2%" }}
                bodyStyle={{ paddingTop: '0', paddingBottom: '10px' }}
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                      {product.edit_name ? (<Input
                      value={product.name}
                      onChange={(e) => {
                        setCoalProducts((prevProducts) => {
                          const newProducts = [...prevProducts];
                          newProducts[index].name = e.target.value;
                          return newProducts;
                        });
                        settable_data((prevProducts) => {
                          const newProducts = [...prevProducts];
                          newProducts[index].product = e.target.value;
                          return newProducts;
                        });
                      }}
                    />) : <p style={{margin: '1px'}}>{product['name']}</p>}
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setCoalProducts((prevProducts) => {
                            const newProducts = [...prevProducts];
                            newProducts[index] = {
                              ...newProducts[index],
                              edit_name: !newProducts[index].edit_name,
                            };
                            return newProducts;
                          });
                        }}
                      />
                    </div>
                    <Button 
                      type="text" 
                      danger 
                      icon={<CloseOutlined />} 
                      onClick={() => deleteProduct(product.id)}
                    />
                  </div>
                }
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ width: "40%" }}>
                    <p><b>Ash %</b></p>
                    <InputNumber status={coalProducts[index]['ash'] < plotData['product_ranges'][index]['min'] ? 'error' : ''} min={plotData['product_ranges'][index]['min']} max={plotData['product_ranges'][index]['max']} onChange={(e) => change_ash(e, index)} style={{width: '100%'}} className="right_text" suffix="%" defaultValue={product.ash} />
                  </div>
                  <div>
                    <p>{Number(table_data[index]?.yeild).toFixed(2) ?? 0}% <b>Yeild</b></p>
                    <p>{Number(table_data[index]?.sg).toFixed(2) ?? 0} <b>SG</b></p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button disabled={!plotData ||plotData['product_ranges']?.at(-1) == null} onClick={addProduct} style={{ width: "60%", marginTop: "2%", marginBottom: '5%', padding: "5%" }} type="primary">
              <h3>Add New Product</h3>
            </Button>
          </div>
          <Table onRow={(record, rowIndex) => {return {onClick: () => {setselected_product(rowIndex)}}}} dataSource={table_data} columns={table_columns} pagination={false}/>
          <div style={{marginTop: '5%', marginBottom: '20px'}}>
            {sankey_plot}
           </div> 
        </div>
      </div>
    </div>
  );
}

export default AppCalculator;
