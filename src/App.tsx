import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate, useLocation } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const FreeProgrammes = lazy(() => import('./pages/free-programmes'));
const TwentyOneDays = lazy(() => import('./pages/21-days'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PlanCheckout = lazy(() => import('./pages/PlanCheckout'));
const Renew = lazy(() => import('./pages/Renew'));
const ReferralContestRegistration = lazy(() => import('./pages/referral-contest-registration'));
const ReferralTnc = lazy(() => import('./pages/ReferralTnc'));
const USDPricing = lazy(() => import('./pages/USDPricing'));
const USDRenew = lazy(() => import('./pages/USDRenew'));
const Upgrade = lazy(() => import('./pages/Upgrade'));
const USDUpgrade = lazy(() => import('./pages/USDUpgrade'));

const JoinRedirect = () => {
  useEffect(() => {
    window.location.replace('https://healthyday.co.in/');
  }, []);
  return null;
};

/**
 * QR / Offline Campaign Redirect
 *
 * /ofl/ref=mp   → https://yoga.healthyday.co.in?ref=mp
 * /ofl/ref=hyd  → https://yoga.healthyday.co.in?ref=hyd
 * /ofl/source=qr&ref=abc → https://yoga.healthyday.co.in?source=qr&ref=abc
 */
const OFL_DESTINATION = 'https://yoga.healthyday.co.in';

const OflRedirect = () => {
  const { '*': wildcard } = useParams();
  useEffect(() => {
    const queryString = wildcard ? `?${wildcard}` : ''; https://yoga.healthyday.co.in/
    window.location.replace(`${OFL_DESTINATION}${queryString}`);
  }, [wildcard]);
  return null;
};

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname.toLowerCase();
    const isPricingOrCheckout =
      pathname.startsWith('/pricing') ||
      pathname.startsWith('/usd-pricing') ||
      pathname.startsWith('/renew') ||
      pathname.startsWith('/usd-renew') ||
      pathname.startsWith('/upgrade') ||
      pathname.startsWith('/usd_upgrade') ||
      pathname.includes('checkout') ||
      pathname.startsWith('/12m') ||
      pathname.startsWith('/6m') ||
      pathname.startsWith('/3m') ||
      pathname.startsWith('/thank-you');

    const isUsd =
      pathname.includes('usd') ||
      Boolean(
        location.state &&
          typeof location.state === 'object' &&
          'isUSDFlow' in location.state &&
          (location.state as any).isUSDFlow
      );

    const newTitle = isPricingOrCheckout ? 'Yoga Plans-Healthyday' : 'Free Programmes-Healthyday';

    let newImage = 'https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/6795ce3db71ab6291dfa64b7/8886171_Referral%20img%20for%20forwarding%203.jpg';
    if (isPricingOrCheckout) {
      if (isUsd) {
        newImage = 'https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/6795ce3db71ab6291dfa64b7/5397638_IntlEnglish%20Free%20Batch%20%20Day%207%20Vertical.png';
      } else {
        newImage = 'https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/6795ce3db71ab6291dfa64b7/9753192_English%20Free%20Batch%20%20Day%207%20Vertical.png';
      }
    }

    document.title = newTitle;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', newTitle);

    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) ogTitleMeta.setAttribute('content', newTitle);

    const ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) ogDescMeta.setAttribute('content', newTitle);

    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) ogImageMeta.setAttribute('content', newImage);

    const twitterImageMeta = document.querySelector('meta[name="twitter:image"]');
    if (twitterImageMeta) twitterImageMeta.setAttribute('content', newImage);
  }, [location.pathname, location.state]);

  return null;
};

const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
    <img src="/logo.webp" alt="Healthyday" style={{ height: 36, opacity: 0.7 }} />
  </div>
);

const App = () => {
  return (
    <Router>
      <TitleUpdater />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<FreeProgrammes />} />
          <Route path="/English" element={<FreeProgrammes defaultLanguage="English" />} />
          <Route path="/english" element={<FreeProgrammes defaultLanguage="English" />} />
          <Route path="/englis" element={<FreeProgrammes defaultLanguage="English" />} />
          <Route path="/Telugu" element={<FreeProgrammes defaultLanguage="Telugu" />} />
          <Route path="/telugu" element={<FreeProgrammes defaultLanguage="Telugu" />} />
          <Route path="/talagu" element={<FreeProgrammes defaultLanguage="Telugu" />} />
          <Route path="/pricing" element={<Home />} />
          <Route path="/usd-pricing" element={<USDPricing />} />
          <Route path="/usd-renew" element={<USDRenew />} />
          <Route path="/renew" element={<Renew />} />
          <Route path="/renew/:planType" element={<Renew />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/usd_upgrade" element={<USDUpgrade />} />

          {/* Checkout Routes */}
          <Route path="/checkout" element={<PlanCheckout />} />
          <Route path="/:planId/checkout" element={<PlanCheckout />} />
          
          <Route path="/12m" element={<PlanCheckout />} />
          <Route path="/6m" element={<PlanCheckout />} />
          <Route path="/3m" element={<PlanCheckout />} />
          <Route path="/12m_usd" element={<PlanCheckout />} />
          <Route path="/6m_usd" element={<PlanCheckout />} />
          <Route path="/3m_usd" element={<PlanCheckout />} />
          <Route path="/renew/12m" element={<PlanCheckout />} />
          <Route path="/renew/6m" element={<PlanCheckout />} />
          <Route path="/renew/3m" element={<PlanCheckout />} />
          <Route path="/renew/12m_usd" element={<PlanCheckout />} />
          <Route path="/renew/6m_usd" element={<PlanCheckout />} />
          <Route path="/renew/3m_usd" element={<PlanCheckout />} />

          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/:planId/checkout/old" element={<PlanCheckout />} />
          <Route path="/free-programmes" element={<FreeProgrammes />} />
          <Route path="/FreeProgrammes" element={<FreeProgrammes />} />
          <Route path="/21days" element={<TwentyOneDays />} />
          <Route path="/21days/English" element={<TwentyOneDays defaultLanguage="English" />} />
          <Route path="/21days/english" element={<TwentyOneDays defaultLanguage="English" />} />
          <Route path="/21days/Telugu" element={<TwentyOneDays defaultLanguage="Telugu" />} />
          <Route path="/21days/telugu" element={<TwentyOneDays defaultLanguage="Telugu" />} />
          <Route path="/21days/telagu" element={<TwentyOneDays defaultLanguage="Telugu" />} />
          <Route path="/21-day" element={<TwentyOneDays />} />
          <Route path="/21-day/English" element={<TwentyOneDays defaultLanguage="English" />} />
          <Route path="/21-day/english" element={<TwentyOneDays defaultLanguage="English" />} />
          <Route path="/21-day/Telugu" element={<TwentyOneDays defaultLanguage="Telugu" />} />
          <Route path="/21-day/telugu" element={<TwentyOneDays defaultLanguage="Telugu" />} />
          <Route path="/21-day/telagu" element={<TwentyOneDays defaultLanguage="Telugu" />} />
          <Route path="/500yogakits" element={<ReferralContestRegistration />} />
          <Route path="/referral-tnc" element={<ReferralTnc />} />
          <Route path="/join" element={<JoinRedirect />} />
          <Route path="/ofl/*" element={<OflRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
