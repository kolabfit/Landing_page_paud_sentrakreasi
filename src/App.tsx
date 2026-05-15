import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Gallery from "./components/Gallery";
import News from "./components/News";
import NewsArchive from "./components/NewsArchive";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PageDetail from "./components/PageDetail";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
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
        </main>
        <Footer />
      </div>
    </Router>
  );
}
