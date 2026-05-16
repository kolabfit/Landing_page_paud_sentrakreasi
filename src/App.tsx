import { HashRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

// Lazy load pages for better performance
const Home = lazy(() => import("./components/Home"));
const Profile = lazy(() => import("./components/Profile"));
const Gallery = lazy(() => import("./components/Gallery"));
const News = lazy(() => import("./components/News"));
const NewsArchive = lazy(() => import("./components/NewsArchive"));
const Contact = lazy(() => import("./components/Contact"));
const PageDetail = lazy(() => import("./components/PageDetail"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 bg-brand-orange/20 rounded-full animate-ping"></div>
      <div className="relative bg-white w-full h-full rounded-full shadow-lg flex items-center justify-center border-4 border-blue-50">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-brand-blue rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/:category" element={<Gallery />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/archive" element={<NewsArchive />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pages/:slug" element={<PageDetail />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

