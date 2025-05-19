import { Card, Input, InputNumber, Button, Upload, message, Table, Select } from "antd";
import { HomeOutlined, LineChartOutlined, InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const error_codes = {
    usr: [
        "Username already exists",
    ],
    psw: [
        "Password does not meet complexity requirements",
    ]
}

function AppSignUp({ ip }){
    const [usr, set_usr] = useState('');
    const [psw, set_psw] = useState('');
    const [psw2, set_psw2] = useState('');
    const [loading, set_loading] = useState(false);
    const [error_msg, set_error_msg] = useState(null);

    function signup(){
        async function fetchData() {
            set_error_msg(null);
            set_loading(true);
            const response = await fetch(`${ip}/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usr,
                    password: psw
                })
            });
            const data = await response.json();
            console.log(response);
            console.log(data);
            if(response.status == 200){
                message.success('Sign Up Successful');
                window.location.href = '/signin';
            }
            else{
                set_error_msg(data.detail);
                message.error('Sign Up Failed');
            }
            set_loading(false);
        }
        fetchData();
    };

    return (
        <Card title={(<h2>Sign Up</h2>)} style={{ width: '50%', margin: 'auto', marginTop: '5%' }}>
        <div style={{ width: '70%', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div>
                <p><b>Username</b></p>
                <Input status={error_codes.usr.includes(error_msg) ? "error": ''} onChange={(e) => {set_usr(e.target.value)}}></Input>
            </div>
            <div>
                <p><b>Password</b></p>
                <Input.Password status={error_codes.psw.includes(error_msg) ? "error": ''} onChange={(e) => {set_psw(e.target.value)}}></Input.Password>
                <p style={{fontSize: '12px', cursor: 'pointer'}} onClick={() => {window.open('https://www.isms.online/iso-27701/clause-6-6-3-user-responsibilities/#:~:text=Password%20Data,length%20(ideally%2012%20characters).')}}>
                    <b>Password Complexity Requirements:</b> 12 Character Minimum, Must Contain at least one Uppercase, Lowercase, Number, and Special Character.
                </p>
            </div>
            <div>
                <p><b>Confirm Password</b></p>
                <Input.Password status={error_codes.psw.includes(error_msg) ? "error": ''} onChange={(e) => {set_psw2(e.target.value)}}></Input.Password>
                { error_msg != null ? 
                <div style={{display: 'flex'}}>
                    <InfoCircleOutlined style={{color: 'red', marginRight: '10px'}}/>
                    <p style={{color: 'red'}}>{error_msg}</p>
                </div> : 
                
                <></> }
            </div>
            <div>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                    { loading ? <Button loading style={{width: '30%'}} type="primary">Sign In</Button> :
                    <Button disabled={psw != psw2 || psw.length == 0} onClick={() => {signup('/signup')}} style={{width: '30%'}} type="primary" >Sign Up</Button>}
                </div>
            </div>
        </div>
        {psw.length > 0}
    </Card>
  );
}

export default AppSignUp;