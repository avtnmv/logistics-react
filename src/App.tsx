import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Homepage from './components/Homepage';
import './App.css';


const RouteDebugger: React.FC = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    console.log('🔍 DEBUG RouteDebugger: Location changed to:', location);
    console.log('🔍 DEBUG RouteDebugger: pathname =', location.pathname);
    console.log('🔍 DEBUG RouteDebugger: search =', location.search);
    console.log('🔍 DEBUG RouteDebugger: hash =', location.hash);
  }, [location]);
  
  return null;
};

function App() {
  console.log('🔍 DEBUG: NODE_ENV =', process.env.NODE_ENV);
  console.log('🔍 DEBUG: process.env =', process.env);
  
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  const isProduction = process.env.NODE_ENV === 'production';
  
  const basename = isDevelopment ? '' : '/logistics-react';
  
  console.log('🔍 DEBUG: isDevelopment =', isDevelopment);
  console.log('🔍 DEBUG: isProduction =', isProduction);
  console.log('🔍 DEBUG: basename =', basename);
  console.log('🔍 DEBUG: Current URL should be accessed at:', isDevelopment ? 'http://localhost:3000' : 'https://avtnmv.github.io/logistics-react');
  
  return (
    <Router basename={basename}>
      <div className="App">
        <RouteDebugger />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/my-transports" element={<Homepage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
