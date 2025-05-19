import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import AppHeader from './components/AppHeader'
import AppHome from "./pages/AppHome";
import AppCalculator from "./pages/AppCalculator";
import AppAbout from "./pages/AppAbout";
import AppReports from "./pages/AppReports";
import AppSignIn from "./pages/AppSignIn";
import AppSignUp from "./pages/AppSignUp";
import AppSettings from "./pages/AppSettings";

const ip = import.meta.env.VITE_APP_API_URL;

console.log(ip);

function App() {
  const [token, set_token] = useState(localStorage.getItem('access_token'));

  return (
    <Router>
        <AppHeader ip={ip} token={token} set_token={set_token}/>
        <main style={{marginTop: '5%'}}>
          <Routes>
            <Route path="/" element={<AppHome />} />
            <Route path="/calculator" element={<AppCalculator ip={ip} token={token}/>} />
            <Route path="/about" element={<AppAbout />} />
            <Route path="/reports" element={<AppReports ip={ip}/>} />
            <Route path="/signin" element={<AppSignIn ip={ip} set_token={set_token}/>} />
            <Route path="/signup" element={<AppSignUp ip={ip}/>} />
            <Route path="/settings" element={<AppSettings ip={ip} token={token} set_token={set_token}/>} />
          </Routes>
        </main>
    </Router>
  )
}

export default App
