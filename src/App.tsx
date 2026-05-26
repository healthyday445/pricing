import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const FreeProgrammes = lazy(() => import('./pages/free-programmes'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PlanCheckout = lazy(() => import('./pages/PlanCheckout'));
const Renew = lazy(() => import('./pages/Renew'));

const JoinRedirect = () => {
  useEffect(() => {
    window.location.replace('https://healthyday.co.in/free-programmes');
  }, []);
  return null;
};

/**
 * QR / Offline Campaign Redirect
 *
 * /ofl/ref=mp   → https://register.dailyyogawithjagan.com?ref=mp
 * /ofl/ref=hyd  → https://register.dailyyogawithjagan.com?ref=hyd
 * /ofl/source=qr&ref=abc → https://register.dailyyogawithjagan.com?source=qr&ref=abc
 */
const OFL_DESTINATION = 'https://register.dailyyogawithjagan.com';

const OflRedirect = () => {
  const { '*': wildcard } = useParams();
  useEffect(() => {
    const queryString = wildcard ? `?${wildcard}` : '';
    window.location.replace(`${OFL_DESTINATION}${queryString}`);
  }, [wildcard]);
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
          <Route path="/renew" element={<Renew />} />
          <Route path="/renew/:planType" element={<Renew />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/checkout" element={<PlanCheckout />} />
          <Route path="/free-programmes" element={<FreeProgrammes />} />
          <Route path="/FreeProgrammes" element={<FreeProgrammes />} />
          <Route path="/join" element={<JoinRedirect />} />
          <Route path="/ofl/*" element={<OflRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
