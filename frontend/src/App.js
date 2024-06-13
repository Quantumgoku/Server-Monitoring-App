import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Report from './components/Report';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

function App() {
  return (
      <Router>
          <div>
              <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path='/register' element={<Register />} />
                  <Route path="/report" element={<Report />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;