import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const JoinRedirect = () => {
  useEffect(() => {
    window.location.replace('https://healthyday.co.in/free-programmes');
  }, []);
  return null;
};
import Home from './pages/Home';
import ThankYou from './pages/ThankYou';
import FreeProgrammes from './pages/free-programmes';
import NotFound from './pages/NotFound';
import PlanCheckout from './pages/PlanCheckout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FreeProgrammes />} />
        <Route path="/pricing" element={<Home />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/checkout" element={<PlanCheckout />} />
        <Route path="/free-programmes" element={<FreeProgrammes />} />
        <Route path="/FreeProgrammes" element={<FreeProgrammes />} />
        <Route path="/join" element={<JoinRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
