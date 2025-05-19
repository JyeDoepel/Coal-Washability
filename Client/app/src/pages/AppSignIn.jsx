import { Card, Input, InputNumber, Button, Upload, message, Table, Select } from "antd";
import { HomeOutlined, LineChartOutlined, InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

function AppSignIn({ ip, set_token }) {
    const [usr, set_usr] = useState('');
    const [psw, set_psw] = useState('');
    const [loading, set_loading] = useState(false);
    const [error_code, set_error_code] = useState(false);
    const navigate = useNavigate();

    async function signIn() {
        set_loading(true);
        const response = await fetch(`${ip}/signin`, {
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
        if (response.status == 200) {
            localStorage.setItem('access_token', data.access_token);
            set_token(data.access_token);
            navigate('/calculator');
        }
        else {
            set_error_code(true);
        }
        console.log(data);
        set_loading(false);
    }

  return (
    <Card title={(<h2>Sign In</h2>)} style={{ width: '50%', margin: 'auto', marginTop: '5%' }}>
        <div style={{ width: '70%', margin: 'auto', gap: '20px', display: 'flex', flexDirection: 'column' }}>
            <div>
                <p><b>Username</b></p>
                <Input status={error_code ? "error": ''} onChange={(e) => {set_usr(e.target.value)}}></Input>
            </div>
            <div>
                <p><b>Password</b></p>
                <Input.Password status={error_code ? "error": ''} onChange={(e) => {set_psw(e.target.value)}}></Input.Password>
                { error_code ? 
                <div style={{display: 'flex'}}>
                    <InfoCircleOutlined style={{color: 'red', marginRight: '10px'}}/>
                    <p style={{color: 'red'}}>Invalid username or password</p>
                </div> : 
                
                <></> }
            </div>
            <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    { loading ? <Button loading style={{width: '30%'}} type="primary">Sign In</Button> :
                    <Button onClick={() => {signIn()}} style={{width: '30%'}} type="primary">Sign In</Button>}
                </div>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                    <Button onClick={() => {navigate('/signup')}} style={{width: '30%'}} >Sign Up</Button>
                </div>
            </div>
        </div>
    </Card>
  );
}

export default AppSignIn;