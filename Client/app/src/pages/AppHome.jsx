import { Card, Input, InputNumber, Button, Upload, message, Table, Select } from "antd";
import Plot from 'react-plotly.js';
import { useNavigate, useLocation } from "react-router-dom";
import bg_img from "../../public/image.png";

function AppHome() {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{position: 'fixed', zIndex: '-1', top: '200px'}}>
        <img style={{marginLeft: '45%', width: '70%', height: '100%', transform: 'rotateY(35deg) rotateX(-15deg) rotateZ(10deg)'}} src={bg_img} alt="" />
      </div>
      <div style={{position: 'fixed', zIndex: '-1', top: '200px', left: '-90%'}}>
        <img style={{width: '70%', height: '100%', marginRight: '70%'}} src={bg_img} alt="" />
      </div>
      <div style={{ height: '50vh'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '10%'}}>
          <h1 style={{fontSize: '48px', textShadow: "1px 1px 1px rgba(0, 0, 0, 0.2)"}}>Coal Washability Analysis</h1>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '2%'}}>
          <p style={{textShadow: "1px 1px 1px rgba(0, 0, 0, 0.2)", fontWeight: '400'}}>Empowering students and operators to effortlessly generate and analyze coal washability curves for better decision-making and efficiency.</p>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '2%', gap: '20px'}}>
          <Button onClick={() => {navigate('/Calculator')}} type="primary">Get Started</Button>
          <Button onClick={() => {navigate('/Reports')}}>Thesis Reports</Button>
        </div>
      </div>

      <div style={{ textAlign: 'justify',padding: '20px 5% 5% 5%', marginTop: '200px', width: '90%', backgroundColor: '#FAFBFE', boxShadow: '0 2px 20px rgba(0, 0, 0, 0.9)'}}>
          <h1>Washability Curves</h1>
          <h2>What are Washabiltiy Curves?</h2>
          <p>As ash is more dense than clean coal, the ash content of a fraction of coal increases as the density of the fraction increases. This feature can be exploited through the use of sink float trials. Small scale tests are carried out using large beakers to determine the coal ash content at different specific gravities, typically ranging from 1.3 - 1.9 SG.</p>
          <p>Starting at the light or heavy end of the beakers typically depends on where the majority of the material will be removed the earliest. As samples need to be dried between, removing as much material as early as possible will reduce the time required for drying. If the lightest end is choses, the coal sample will be first placed in the beaker with the lowest specific gravity. The floats of this trial are scooped off the surface, dried, and analysed for ash content. The sinks are then strained, allowed to dry, and then added to the next beaker of increasing specific gravity. Again, the floats in the beaker are scooped off, dried and analysed and the sinks are poured through a strainer, dried, and placed into the next beaker. This is continued for the remainder of the beakers.</p>
          <p>From the results obtained from the ash content of each fraction, four washability curves can be developed:</p>
          <ul>
            <li>The Specific Gravity Curve (Densimetric Curve)</li>
            <li>The Cumulative Floats Curve</li>
            <li>The Cumulative Sinks Curve</li>
            <li>The Instantaneous Ash Curve</li>
          </ul>
          <h2>The Specific Gravity Curve (Densimetric Curve)</h2>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <p style={{width: '45%'}}>The specific gravity curve shows the relationship between the density of the separation and the yield of clean coal (floats). Thus, if the density of separation is known, then the yield of clean coal can also be found from the graph. By convention, the specific gravity axis is typically on the top horizontal axis and the cumulative weight percentage of floats is typically on the left vertical axis.</p>
            <Plot data={[{
                x: [1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.1],
                y: [8,26,40,52,60,68,73,76,100],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' },
                name: 'The Densimetric Curve',
                xaxis: 'x1',
                yaxis: 'y1',
              }]}
              layout={{
                xaxis1: { range: [2.1+0.1, 1.3-0.1], title: {text: 'SPECIFIC GRAVITY', standoff: 0}, side:'top', showgrid: false,
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
              style={{ width: '50%', height: '300px' }}
            />
          </div>
          <h2>The Cumulative Floats Curve</h2>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Plot data={[{
                x: [1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.1],
                y: [8,26,40,52,60,68,73,76,100],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' },
                name: 'The Densimetric Curve',
                xaxis: 'x1',
                yaxis: 'y1',
              },
              {
                x: [2,4.0769230769230775,5.800000000000001,7.461538461538463,8.600000000000001,10.058823529411764,11.424657534246576,12.434210526315788,28.89],
                y: [8,26,40,52,60,68,73,76,100],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'orange' },
                name: 'The Cumulative Floats Curve',
                xaxis: 'x2',
                yaxis: 'y1',
              },
            ]}
              layout={{
                xaxis1: { range: [2.1+0.1, 1.3-0.1], title: {text: 'SPECIFIC GRAVITY', standoff: 0}, side:'top', showgrid: false,
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
              style={{ width: '50%', height: '300px' }}
            />
            <div style={{width: '45%'}}>
              <p>The cumulative floats curve gives the relationship between the yield of clean coal (floats) and the ash content of the coal. Thus, if the required ash content is known, then the yield or cumulative weight percentage of floats can be found from the graph. Conversely, if the yield of clean coal is known, then the expected ash content can be found from the graph. By convention, the ash content axis is typically on the bottom horizontal axis and the cumulative weight percentage of floats (yield of clean coal) is typically on the left vertical axis.</p>
              <p>The cumulative floats curve can be used with the densimetric (specific gravity) curve. If the ash content of the clean coal yield is known, then from the cumulative floats curve, the yield can be obtained. This value for the yield can then be used to find the density of the separation required from the densimetric curve.</p>
            </div>
          </div>
          <h2>The Cumulative Sinks Curve</h2>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{width: '45%'}}>
                <p>The cumulative sink curve gives the relationship between the yield of sinks and the ash content of the sinks. So, if the yield of the sinks is known, then the ash content of the sinks can be found from the graph. Conversely, if the ash of the sinks is known then the yield of sinks can be found from the graph.</p>
                <p>The cumulative sink curve can be used with the cumulative float curve and the densimetric curve. If the ash of the floats is known, then the yield of the floats can be obtained from the cumulative floats curve. If the density is known, then the yield of floats can be obtained from the densimetric curve. In either case the yield of sinks is known, so the ash of the sinks can be found from the cumulative sinks curve.</p>
            </div>
            <Plot data={[{
                x: [1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.1],
                y: [8,26,40,52,60,68,73,76,100],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' },
                name: 'The Densimetric Curve',
                xaxis: 'x1',
                yaxis: 'y1',
              },
              {
                x: [2,4.0769230769230775,5.800000000000001,7.461538461538463,8.600000000000001,10.058823529411764,11.424657534246576,12.434210526315788,28.89],
                y: [8,26,40,52,60,68,73,76,100],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'orange' },
                name: 'The Cumulative Floats Curve',
                xaxis: 'x2',
                yaxis: 'y1',
              },
              {
                x: [31.228260869565215,37.60810810810811,44.28333333333334,52.10416666666667,59.325,68.90625,76.11111111111111,81,"None"],
                y: [92,74,60,48,40,32,27,24,0],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'green' },
                name: 'The Cumulative Sinks Curve',
                xaxis: 'x2',
                yaxis: 'y2',
              },
            ]}
              layout={{
                xaxis1: { range: [2.1+0.1, 1.3-0.1], title: {text: 'SPECIFIC GRAVITY', standoff: 0}, side:'top', showgrid: false,
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
              style={{ width: '50%', height: '300px' }}
            />
          </div>
          <h2>The Instantaneous Ash Curve (Characteristic Ash Curve)</h2>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Plot data={[{
                x: [1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.1],
                y: [8,26,40,52,60,68,73,76,100],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' },
                name: 'The Densimetric Curve',
                xaxis: 'x1',
                yaxis: 'y1',
              },
              {
                x: [2,4.0769230769230775,5.800000000000001,7.461538461538463,8.600000000000001,10.058823529411764,11.424657534246576,12.434210526315788,28.89],
                y: [8,26,40,52,60,68,73,76,100],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'orange' },
                name: 'The Cumulative Floats Curve',
                xaxis: 'x2',
                yaxis: 'y1',
              },
              {
                x: [31.228260869565215,37.60810810810811,44.28333333333334,52.10416666666667,59.325,68.90625,76.11111111111111,81,"None"],
                y: [92,74,60,48,40,32,27,24,0],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'green' },
                name: 'The Cumulative Sinks Curve',
                xaxis: 'x2',
                yaxis: 'y2',
              },
              {
                x: [2,5,9,13,16,21,30,37,81],
                y: [4,17,33,46,56,64,70.5,74.5,88],
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'purple' },
                name: 'The Instantaneous Ash Curve',
                xaxis: 'x2',
                yaxis: 'y1',
              },
            ]}
              layout={{
                xaxis1: { range: [2.1+0.1, 1.3-0.1], title: {text: 'SPECIFIC GRAVITY', standoff: 0}, side:'top', showgrid: false,
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
              style={{ width: '50%', height: '300px' }}
            />
              <div style={{width: '45%'}}>
                <p>The Instantaneous ash curve (characteristic ash curve) gives the relationship between the yield of the floats and the ash content of the particle that just floats or just sinks at that yield. It thus gives the highest ash in the floats or the lowest ash in the sinks.</p>
                <p>The instantaneous ash curve can be used with the other three washability curves, the specific gravity curve, the cumulative float curve, and the cumulative sink curve.</p>
              </div>
            </div>
      
      </div>

    </div>
  );
}

export default AppHome;