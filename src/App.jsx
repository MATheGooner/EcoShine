import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileActions from "./components/layout/MobileActions";
import Seo from "./components/layout/Seo";
import HomePage from "./pages/HomePage";
const ServicePage = lazy(() => import("./pages/ServicePage"));
const QuotePage = lazy(() => import("./pages/QuotePage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function RouteEffects() { const { pathname, hash } = useLocation(); useEffect(() => { const frame = window.requestAnimationFrame(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); else { window.scrollTo({ top: 0, behavior: "instant" }); document.getElementById("main-content")?.focus({ preventScroll: true }); } }); return () => window.cancelAnimationFrame(frame); }, [pathname, hash]); return null; }
export default function App() { return <><a className="skip-link" href="#main-content">Skip to main content</a><RouteEffects /><Header /><main id="main-content" tabIndex="-1"><Seo /><Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}><Routes><Route path="/" element={<HomePage />} /><Route path="/services/:serviceSlug" element={<ServicePage />} /><Route path="/quote" element={<QuotePage />} /><Route path="/thank-you" element={<ThankYouPage />} /><Route path="*" element={<NotFoundPage />} /></Routes></Suspense></main><Footer /><MobileActions /></>; }
