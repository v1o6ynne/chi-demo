import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Simulate from './Simulate';
import Evaluate from './Evaluate';
import TestBackend from './TestBackend';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Route to Home component */}
        <Route path="/simulate" element={<Simulate />} /> {/* Route to Simulate component */}
        <Route path="/evaluate" element={<Evaluate />} /> {/* Route to Evaluate component */}
        <Route path="/testbackend" element={<TestBackend />} /> {/* Route to Test component */}
      </Routes>
    </Router>
  );
};

export default App;