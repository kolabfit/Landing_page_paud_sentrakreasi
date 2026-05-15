import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCmsSettings } from "../lib/useCmsSettings";
import { CmsPage, getPages } from "../lib/cms";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isMobileGalleryOpen, setIsMobileGalleryOpen] = useState(false);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const { settings } = useCmsSettings();

  const getBrandParts = (name?: string) => {
    const fallback = "PAUD HUSNUL KHOIR";
    const safeName = name && name.trim() ? name.trim() : fallback;
    const parts = safeName.split(/\s+/);
    if (parts.length <= 1) {
      return { primary: safeName, secondary: "" };
    }
    return { primary: parts[0], secondary: parts.slice(1).join(" ") };
  };

  const { primary, secondary } = getBrandParts(settings?.site_name);
  const logoSrc = settings?.site_logo || "/Logo_1_-removebg-preview.png";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    getPages()
      .then((data) => {
        if (isMounted) {
          setPages(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPages([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/profile" },
    { name: "Galeri", href: "/gallery" },
    { name: "Berita", href: "/news" },
    { name: "Kontak", href: "/contact" },
  ];

  const location = useLocation();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-border-light shadow-sm py-3"
          : "bg-white/90 backdrop-blur-sm py-5 border-b border-transparent shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <motion.img
            src={logoSrc}
            alt={`${primary} ${secondary}`.trim() || "Logo"}
            className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm origin-left"
            whileHover={{ scale: 1.05, filter: "brightness(1.05)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          />
          <div className="flex flex-col justify-center ml-2 sm:ml-3">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-brand-blue leading-none transition-all duration-300">
              {primary}
            </span>
            {secondary ? (
              <span className="font-bold text-sm sm:text-base tracking-wide text-brand-orange leading-tight transition-all duration-300 mt-0.5">
                {secondary}
              </span>
            ) : null}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              (link.name === "Galeri" &&
                location.pathname.startsWith("/gallery")) ||
              location.pathname === link.href;
            if (link.name === "Galeri") {
              return (
                <div
                  key={link.name}
                  className="relative group cursor-pointer py-2"
                >
                  <div
                    className={`font-medium uppercase tracking-widest text-sm transition-colors border-b-2 hover:border-brand-blue flex items-center gap-1 ${
                      isActive
                        ? "text-heading border-brand-blue"
                        : "text-muted border-transparent group-hover:text-brand-blue group-hover:border-brand-blue"
                    }`}
                  >
                    {link.name}{" "}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-56 bg-white rounded-[24px] shadow-xl border border-border-light pt-2 pb-2">
                    {pages.filter(p => p.slug.startsWith("galeri-") || p.slug.startsWith("gallery-") || p.slug.toLowerCase() === "galeri").length > 0 ? (
                      pages.filter(p => p.slug.startsWith("galeri-") || p.slug.startsWith("gallery-") || p.slug.toLowerCase() === "galeri").map(page => (
                        <Link
                          key={page.id}
                          to={`/gallery/${page.slug.replace("galeri-", "").replace("gallery-", "")}`}
                          className="block px-6 py-3 text-sm font-bold text-muted hover:bg-blue-50 hover:text-brand-blue transition-colors"
                        >
                          {page.title}
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link
                          to="/gallery/kegiatan"
                          className="block px-6 py-3 text-sm font-bold text-muted hover:bg-blue-50 hover:text-brand-blue transition-colors"
                        >
                          Kegiatan Interaktif
                        </Link>
                        <Link
                          to="/gallery/sarana"
                          className="block px-6 py-3 text-sm font-bold text-muted hover:bg-blue-50 hover:text-brand-blue transition-colors"
                        >
                          Sarana Prasarana
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium uppercase tracking-widest text-sm transition-colors border-b-2 hover:border-brand-blue ${
                  isActive
                    ? "text-heading border-brand-blue"
                    : "text-muted border-transparent hover:text-brand-blue"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          {pages.filter(p => !["beranda", "galeri", "gallery", "profil", "profile", "kontak", "berita"].includes(p.title.toLowerCase()) && !p.slug.startsWith("galeri-") && !p.slug.startsWith("gallery-")).map((page) => {
            const href = `/pages/${page.slug.replace(/^\/+/, "")}`;
            const isActive = location.pathname === href;
            return (
              <Link
                key={page.id}
                to={href}
                className={`font-medium uppercase tracking-widest text-sm transition-colors border-b-2 hover:border-brand-blue ${
                  isActive
                    ? "text-heading border-brand-blue"
                    : "text-muted border-transparent hover:text-brand-blue"
                }`}
              >
                {page.title}
              </Link>
            );
          })}
          <Link
            to="/profile"
            className="px-6 py-2.5 bg-brand-orange hover:bg-orange-500 text-white rounded-full font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Mulai Eksplorasi
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-white p-6 shadow-xl md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center group">
                <img
                  src={logoSrc}
                  alt={`${primary} ${secondary}`.trim() || "Logo"}
                  className="h-12 w-auto object-contain drop-shadow-sm"
                />
                <div className="flex flex-col justify-center ml-2">
                  <span className="font-extrabold text-xl tracking-tight text-brand-blue leading-none transition-colors duration-300">
                    {primary}
                  </span>
                  {secondary ? (
                    <span className="font-bold text-sm tracking-wide text-brand-orange leading-tight transition-colors duration-300 mt-0.5">
                      {secondary}
                    </span>
                  ) : null}
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-muted"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive =
                  (link.name === "Galeri" &&
                    location.pathname.startsWith("/gallery")) ||
                  location.pathname === link.href;
                if (link.name === "Galeri") {
                  return (
                    <div
                      key={link.name}
                      className="flex flex-col border-b border-border-light pb-2 pt-2"
                    >
                      <button
                        onClick={() =>
                          setIsMobileGalleryOpen(!isMobileGalleryOpen)
                        }
                        className={`flex items-center justify-between w-full font-extrabold uppercase tracking-widest text-base transition-colors ${
                          isActive
                            ? "text-heading"
                            : "text-muted hover:text-heading"
                        }`}
                      >
                        {link.name}
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${isMobileGalleryOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isMobileGalleryOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-3 mt-4 px-4 overflow-hidden"
                          >
                            {pages.filter(p => p.slug.startsWith("galeri-") || p.slug.startsWith("gallery-") || p.slug.toLowerCase() === "galeri").length > 0 ? (
                              pages.filter(p => p.slug.startsWith("galeri-") || p.slug.startsWith("gallery-") || p.slug.toLowerCase() === "galeri").map(page => (
                                <Link
                                  key={page.id}
                                  to={`/gallery/${page.slug.replace("galeri-", "").replace("gallery-", "")}`}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsMobileGalleryOpen(false);
                                  }}
                                  className="text-sm font-bold text-muted hover:text-brand-blue"
                                >
                                  {page.title}
                                </Link>
                              ))
                            ) : (
                              <>
                                <Link
                                  to="/gallery/kegiatan"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsMobileGalleryOpen(false);
                                  }}
                                  className="text-sm font-bold text-muted hover:text-brand-blue"
                                >
                                  Kegiatan Interaktif
                                </Link>
                                <Link
                                  to="/gallery/sarana"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsMobileGalleryOpen(false);
                                  }}
                                  className="text-sm font-bold text-muted hover:text-brand-blue"
                                >
                                  Sarana Prasarana
                                </Link>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-extrabold uppercase tracking-widest text-base border-b border-border-light pb-3 pt-2 transition-colors ${
                      isActive
                        ? "text-heading"
                        : "text-muted hover:text-heading"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {pages.filter(p => !["beranda", "galeri", "gallery", "profil", "profile", "kontak", "berita"].includes(p.title.toLowerCase()) && !p.slug.startsWith("galeri-") && !p.slug.startsWith("gallery-")).map((page) => {
                const href = `/pages/${page.slug.replace(/^\/+/, "")}`;
                const isActive = location.pathname === href;
                return (
                  <Link
                    key={page.id}
                    to={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-extrabold uppercase tracking-widest text-base border-b border-border-light pb-3 pt-2 transition-colors ${
                      isActive
                        ? "text-heading"
                        : "text-muted hover:text-heading"
                    }`}
                  >
                    {page.title}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
