import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "antd";
import { HomeOutlined, LineChartOutlined, InfoCircleOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';

import icon_img from "../../public/Icon.png";

const items = [
    {
      label: 'Home',
      key: '/',
      icon: <HomeOutlined />,
    },
    {
      label: 'Calculator',
      key: '/Calculator',
      icon: <LineChartOutlined />,
    },
    {
      label: 'Reports',
      key: '/Reports',
      icon: <FileTextOutlined />,
    },
    {
      label: 'About',
      key: '/About',
      icon: <InfoCircleOutlined />,
    },
]

function AppHeader({ ip, token, set_token }) {
    const location = useLocation();
    const [appRoute, setCappRoute] = useState(location.pathname);
    const [user, set_user] = useState(null);

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
            set_token(null); // Only update if component is still mounted
            set_user(null);
          }
        }
      }
      if (token !== null) {
        fetchData();
      }
      return () => { isMounted = false; };
    }, [token]);

    const navigate = useNavigate();

    function goToCalculator(subPath) {
        setCappRoute(subPath);
        navigate(subPath);
    }

    function goToSignIn() {
        if (user != null) {
          localStorage.removeItem('access_token');
          set_token(null);
          set_user(null);
        } else {
          setCappRoute('/signin');
          navigate('/signin');
        }
    }

    return (
      <header style={{ 
        display: 'flex',
        padding: '0 2%',
        alignItems: 'center',
        borderBottom: '3px solid #1677FF',
        justifyContent: 'space-between'  // Ensures first and last elements go to edges
    }}>
        <img onClick={() => goToCalculator('/')} style={{width: '80px', cursor: 'pointer'}} src={icon_img} alt="" />
        <h1 onClick={() => goToCalculator('/')} style={{ marginRight: '2%', cursor: 'pointer' }}>Coal Washability Analysis</h1>
        
        <div style={{ flexGrow: 1 }}> 
            <Menu onClick={(e) => { goToCalculator(e.key) }} selectedKeys={[appRoute]} mode="horizontal" items={items} />
        </div>
        <div style={{ minWidth: '100px'}}>
        {user != null ?
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ margin: '0px' }}>
              {user}
            </p>
            <SettingOutlined onClick={() => navigate('/settings')} className="no_border_button" style={{cursor: 'pointer'}}/>
          </div>
          :
          <></>}

          <p className="no_border_button" style={{ marginLeft: 'auto', cursor: 'pointer', marginTop: '5px', textAlign: 'right' }} onClick={goToSignIn}>
              <b>{user == null ? "Sign In" : "Sign Out"}</b>
          </p>
        </div>

    </header>
    )
}

export default AppHeader;