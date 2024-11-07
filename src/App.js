// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have Bootstrap CSS
import MultiStepForm from './components/MultiStepForm'; // Adjust the path as necessary
import DailyReport from './components/DailyReport'; // Adjust the path as necessary
import MonthlyPage from './components/MonthlyPage'; // Adjust the path as necessary
import HomePage from './HomePage'; // Assuming HomePage is in the same directory

const App = () => {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/add-record" element={<MultiStepForm />} />
                  <Route path="/daily-report" element={<DailyReport />} />
                  <Route path="/monthly-report" element={<MonthlyPage/>} />

<Route path="/bhopal-report" element={
  <div style={{ backgroundColor: '#4EB5ED', minHeight: '100vh', padding: '20px' }} className="text-center">
    <h1>Bhopal Report Page</h1>
    <img 
      src="/underconstruct.gif" 
      alt="Under Construction" 
      style={{ 
        width: '100%', // Make it responsive
        maxWidth: '500px', // Limit the maximum width
        height: 'auto', // Maintain aspect ratio
        padding: '10px', // Add some padding
        borderRadius: '8px' // Optional: add rounded corners
      }} 
    />
    <h6>Please Contact Us : mail@tanishk.me</h6>
  </div>
} />

              </Routes>
          </div>
      </Router>
  );
};

export default App;
