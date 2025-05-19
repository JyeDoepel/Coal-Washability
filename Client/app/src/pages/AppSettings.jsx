import { Card, Input, InputNumber, Button, Upload, message, Table, Select ,Spin } from "antd";
import { DeleteOutlined, LineChartOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function AppSettings({ ip, token, set_token  }) {

    const [user, set_user] = useState(null);
    const [saved_plots, set_saved_plots] = useState([]);
    const [run_saved_plots, set_run_saved_plots] = useState(0);

    const [user_to_edit, set_user_to_edit] = useState(null);
    const [user_error, set_user_error] = useState(false);

    const [psw, set_psw] = useState('');
    const [psw_error, set_psw_error] = useState(false);

    const [loading_req, set_loading] = useState(null);

    const navigate = useNavigate();


    function goToSignIn() {
        localStorage.removeItem('access_token');
        set_token(null);
        set_user(null);
        navigate('/signin');
    }

    async function get_saved_plots() {
        const response = await fetch(`${ip}/saved_plots/${token}`);
        if (response.status == 200) {
            const data = await response.json();
            console.log(data);
            set_saved_plots(data);
        }
        else {
            goToSignIn(); // Only update if component is still mounted
        }
    }

    useEffect(() => {
        if (run_saved_plots > 0) {
            get_saved_plots();
        }
    }, [run_saved_plots]);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
        const response = await fetch(`${ip}/authenticate/${token}`);
        const data = await response.json();
        if (response.status == 200) {
            if (isMounted) {
                set_user(data.sub); // Only update if component is still mounted
                set_user_to_edit(data.sub);
                get_saved_plots();
            }
        }
        else {
            if (isMounted) {
                goToSignIn(); // Only update if component is still mounted
            }
        }
        }
        if (token !== null) {
            fetchData();
        } else {
            goToSignIn();
        }
        return () => { isMounted = false; };
    }, [token]);

    async function save_username() {
        set_loading('username');
        set_user_error(false);
        const response = await fetch(`${ip}/change_username/${token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user_to_edit
            }),
          });

        if (response.status == 200) {
            const data = await response.json();
            message.success('Username changed successfully');
            set_user(user_to_edit);
            localStorage.setItem('access_token', data.access_token);
            set_token(data.access_token);
        }  else {
            const data = await response.json();
            message.error(data.detail);
            if (data.detail == 'Syncronization error') {
                goToSignIn();
            }
            if (data.detail == 'Username already exists') {
                set_user_error(true);
            }
        }
        set_loading(null);
    }

    async function save_password() {
        set_loading('password');
        set_psw_error(false);

        const response = await fetch(`${ip}/change_password/${token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: psw
            }),
          });
        if (response.status == 200) {
            message.success('Password changed successfully');
            set_psw('');
            
        }
        else {
            const data = await response.json();
            message.error(data.detail);
            if (data.detail == 'Syncronization error') {
                goToSignIn();
            }
            else {
                set_psw_error(true);
            }
        }
        set_loading(null);
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

    async function delete_account() {
        const response = await fetch(`${ip}/delete_account/${token}`);
        if (response.status == 200) {
            message.success('Account deleted successfully');
            goToSignIn();
        } else {
            message.error(response.detail);
        }
    }

    return (
        <div style={{maxWidth: '900px', width: '100%', alignItems: 'center', margin: 'auto', paddingBottom: '50px'}}>
            {user == null ?
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px'}}>
                    <Spin size="large" />
                </div>
            : 
            <Card title={
                <div>
                    <h2>Settings</h2>
                </div>
            }>
                <div style={{ width: '70%', margin: 'auto', gap: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <p><b>Username</b></p>
                        <Input status={user_error ? "error": ''} value={user_to_edit} onChange={(e) => {set_user_to_edit(e.target.value)}}/>
                        <div style={{display: 'flex', justifyContent: 'right'}}>
                            <Button loading={loading_req == 'username'} onClick={() => save_username()} disabled={user_to_edit == user || loading_req != null || !user_to_edit} type="primary" style={{marginTop: '10px'}}>Save Username</Button>
                        </div>
                    </div>
                    <div>
                        <p><b>Change Password</b></p>
                        <Input.Password status={psw_error ? "error": ''} onChange={(e) => {set_psw(e.target.value)}}/>
                        <div style={{display: 'flex', justifyContent: 'right'}}>
                            <Button onClick={() => save_password()} loading={loading_req == 'password'} disabled={!psw|| loading_req != null} type="primary" style={{marginTop: '10px'}}>Save Password</Button>
                        </div>
                    </div>
                    <div>
                    <h2>Saved Curves</h2>
                        {saved_plots.length == 0 ? <p style={{textAlign: 'center'}}>No Saved Curves Yet.</p> : ''}
                        {saved_plots.map((plot) => (
                        <div className="saved_plot" style={{cursor: 'pointer',display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc'}}>
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

                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                        <Button onClick={() => delete_account()} type="primary" danger>Delete Account</Button>
                    </div>
                </div>

            </Card>
            }
        </div>
    );
}

export default AppSettings;