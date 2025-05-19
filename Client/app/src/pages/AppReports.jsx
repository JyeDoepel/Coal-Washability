import { useEffect, useState } from "react";
import { Spin, Card, message } from "antd";
 
const options = [
    { value: 'Progress Report', label: 'Progress Report' },
    { value: 'Thesis Report', label: 'Thesis Report' },
];

function AppReports({ ip }) {
    const [report_data, set_report_data] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${ip}/reports/`);
            const data = await response.json();
            console.log(data);
            set_report_data(data);
        }
        fetchData();
    }, [])

    async function get_report_data(report) {
        const response = await fetch(`${ip}/read_report/${report}`);
        if (response.status == 200) {
            const data = await response.json();
            console.log(data);
            set_report_data(data);
        }
        else {
            message.error('Error fetching report data');
        }
    }
  
    return (
        <div style={{ maxWidth: '1400px', margin: 'auto', display: 'flex ', alignItems: 'center', justifyContent: 'space-between'}}>
            <Card style={{width: '23%'}}>
                {options.map((option, index) => (
                    <div onClick={() => get_report_data(option.value)} key={index} style={{ margin: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                        {option.label}
                    </div>
                ))}

            </Card>
            <Card style={{
                width: '75%',
                maxHeight: '70vh',       // Set a height limit
                overflow: 'auto',         // Enable scroll if content exceeds height
                padding: '16px',          // Optional: space for content
                boxSizing: 'border-box'   // Ensures padding doesn’t affect height
            }}>
                {report_data.map((para, index) => 
                    para.style === 'Title' ? <h1 key={index}>{para.text}</h1> : 
                    para.style === 'Heading 1' ? <h2>{para.text}</h2> :
                    para.style === 'Heading 2' ? <h3>{para.text}</h3> :
                    para.style === 'Normal' ? <p style={{ margin: '1px', textIndent: '2em', textAlign: 'justify', marginTop:'1.5em' }}>{para.text}</p> : null
                )}
                
            </Card>

            {/* <div style={{ maxWidth: '700px', margin: 'auto' }}>
                {report_data.length === 0 ? 
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Spin size="large" />
                </div>
                : 
                report_data.map((para, index) => 
                    para.style === 'Title' ? <h1 key={index}>{para.text}</h1> : 
                    para.style === 'Heading 1' ? <h2>{para.text}</h2> :
                    para.style === 'Heading 2' ? <h3>{para.text}</h3> :
                    para.style === 'Normal' ? <p style={{ margin: '1px', textIndent: '2em', textAlign: 'justify', marginTop:'1.5em' }}>{para.text}</p> : null
                )}
            </div> */}
        </div>
    )
}


export default AppReports;