import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const FreeProgrammes = lazy(() => import('./pages/free-programmes'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PlanCheckout = lazy(() => import('./pages/PlanCheckout'));

const JoinRedirect = () => {
  useEffect(() => {
    window.location.replace('https://healthyday.co.in/free-programmes');
  }, []);
  return null;
};

const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
    <img src="/logo.png" alt="Healthyday" style={{ height: 36, opacity: 0.7 }} />
  </div>
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<FreeProgrammes />} />
          <Route path="/English" element={<FreeProgrammes defaultLanguage="English" />} />
          <Route path="/Telugu" element={<FreeProgrammes defaultLanguage="Telugu" />} />
          <Route path="/pricing" element={<Home />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/checkout" element={<PlanCheckout />} />
          <Route path="/free-programmes" element={<FreeProgrammes />} />
          <Route path="/FreeProgrammes" element={<FreeProgrammes />} />
          <Route path="/join" element={<JoinRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
