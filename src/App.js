// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have Bootstrap CSS
import MultiStepForm from './components/MultiStepForm'; // Adjust the path as necessary
import DailyReport from './components/DailyReport'; // Adjust the path as necessary
import HomePage from './HomePage'; // Assuming HomePage is in the same directory

const App = () => {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/add-record" element={<MultiStepForm />} />
                  <Route path="/daily-report" element={<DailyReport/>}/>
                  <Route path="/monthly-report" element={<div>Monthly Report Page</div>} />
                  <Route path="/bhopal-report" element={<div>Bhopal Report Page</div>} />
                  {/* Add more routes for other report pages here */}
              </Routes>
          </div>
      </Router>
  );
};

export default App;
