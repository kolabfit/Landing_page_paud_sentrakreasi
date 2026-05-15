import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import Hero from "./Hero";
import {
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Shield,
  Heart,
  Smile,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CmsPageDetail, getPages } from "../lib/cms";
import { BlockRenderer } from "./PageDetail";

const programs = [
  {
    icon: <BookOpen className="w-8 h-8 text-brand-blue" />,
    title: "Kurikulum Sentra",
    description:
      "Metode pembelajaran berbasis sentra yang disesuaikan dengan tahap perkembangan holistik anak untuk mengoptimalkan kecerdasan majemuk mereka.",
  },
  {
    icon: <Heart className="w-8 h-8 text-brand-orange" />,
    title: "Pendidikan Karakter",
    description:
      "Fokus pada pembentukan akhlak mulia, kemandirian, dan empati sebagai pondasi utama sebelum memasuki jenjang pendidikan dasar.",
  },
  {
    icon: <Users className="w-8 h-8 text-brand-orange" />,
    title: "Kelas Interaktif",
    description:
      "Kegiatan belajar dan bermain yang dirancang untuk mendorong kolaborasi antar siswa dan meningkatkan kemampuan sosial emosional.",
  },
];

export default function Home() {
  const [cmsPage, setCmsPage] = useState<CmsPageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPages()
      .then((items) => {
        if (!isMounted) return;
        // Find the page titled "Beranda" or with slug matching beranda
        const match = (items as CmsPageDetail[]).find(
          (item) => item.title.toLowerCase() === "beranda" || item.slug.toLowerCase().includes("beranda") || item.slug.toLowerCase() === "tumbuh-berkembang-di-paud-husnul-khoir"
        );
        if (match) {
          setCmsPage(match);
        }
      })
      .catch((err) => {
        console.error("Failed to load CMS home page:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const ctaBlocks = useMemo(() => {
    if (!cmsPage?.content) return [];
    return cmsPage.content
      .filter((block) => block.type === "cta-banner")
      .map((block) => block.data || {});
  }, [cmsPage]);

  const contentBlocks = useMemo(() => {
    if (!cmsPage?.content) return [];
    return cmsPage.content.filter((block) => block.type !== "cta-banner");
  }, [cmsPage]);

  // If loading, we can show a brief loading state or just nothing until we know
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background abstract shapes for loading screen */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-brand-orange/5 rounded-full blur-2xl"></div>

        <div className="relative w-32 h-32 mb-8 z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-orange/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-4 bg-brand-blue/10 rounded-full animate-pulse"></div>
          {/* Logo container */}
          <div className="relative bg-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center border-4 border-blue-50 z-20">
            <div className="w-8 h-8 border-4 border-brand-orange border-t-brand-blue rounded-full animate-spin"></div>
          </div>
        </div>
        <h3 className="text-2xl font-black text-brand-blue mb-3 z-10 tracking-tight">Memuat Beranda...</h3>
        <p className="text-muted font-medium text-center max-w-xs z-10 leading-relaxed">
          Tunggu sebentar, kami sedang mengambil konten terbaru.
        </p>
      </div>
    );
  }

  // If we found a CMS page for Beranda, render it
  if (cmsPage) {
    return (
      <div className="bg-white min-h-screen relative overflow-hidden">
        {/* Abstract background blobs for the entire page */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-blue/5 via-brand-blue/0 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-orange/5 via-brand-orange/0 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <section className="pt-32 pb-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ── Content Blocks (Hero, text, tabs, etc.) ── */}
            {contentBlocks.length > 0 && (
              <div className="space-y-16">
                {contentBlocks.map((block, index) => (
                  <motion.div 
                    key={block.id || `block-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <BlockRenderer block={block} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── CTA Banner Blocks ── */}
            {ctaBlocks.length > 0 && (
              <div className="space-y-12 mt-24 mb-10">
                {ctaBlocks.map((cta, index) => {
                  const backgroundImage = cta.background_image_url || cta.background_image || cta.image_url || cta.image;
                  const backgroundColor = cta.background_color || "#fffafa";
                  return (
                    <motion.div
                      key={`${cmsPage.id}-cta-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="relative overflow-hidden rounded-[48px] shadow-[0_20px_50px_-25px_rgba(26,149,196,0.3)] group hover:shadow-[0_30px_60px_-25px_rgba(26,149,196,0.4)] transition-all duration-500"
                      style={{ backgroundColor }}
                    >
                      {backgroundImage ? (
                        <div className="absolute inset-0">
                          <img
                            src={backgroundImage}
                            alt={cta.headline || "CTA background"}
                            className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 via-brand-blue/80 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-sky-500"></div>
                      )}
                      
                      {/* Decorative elements */}
                      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                      <div className="absolute -bottom-24 left-1/2 w-64 h-64 bg-brand-orange/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>

                      <div className="relative z-10 p-12 md:p-16 lg:w-2/3">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                          {cta.headline || "Judul belum diisi"}
                        </h2>
                        {cta.sub_headline ? (
                          <p className="text-xl text-sky-100 font-medium mb-8 max-w-2xl leading-relaxed">
                            {cta.sub_headline}
                          </p>
                        ) : null}
                        {cta.button_text && cta.button_link ? (
                          <a
                            href={cta.button_link}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-brand-orange text-white rounded-full font-extrabold shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:bg-orange-500 transition-all duration-300 border-2 border-brand-orange hover:border-orange-400"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {cta.button_text}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </a>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Fallback to the original static hardcoded Beranda if no CMS page is found
  return (
    <>
      <Hero />

      {/* Program Unggulan Section */}
      <section
        id="program-unggulan"
        className="py-24 bg-white border-b border-border-light scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 bg-brand-light text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
              Keunggulan Edukatif
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-heading mb-6 tracking-tight">
              Metode Belajar Sambil Bermain
            </h2>
            <p className="text-lg md:text-xl text-muted font-medium">
              Bukan sekadar hafalan, kami merancang kurikulum yang memadukan
              stimulasi kognitif dan interaksi sosial dengan pendekatan bermain
              yang membahagiakan anak.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="bg-brand-light p-8 rounded-[32px] border border-blue-50 hover:shadow-2xl hover:shadow-blue-500/20 hover:bg-white transition-all duration-500 group cursor-default"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md transition-all duration-300">
                  {program.icon}
                </div>
                <h3 className="text-2xl font-black text-heading mb-4">
                  {program.title}
                </h3>
                <p className="text-muted leading-relaxed font-medium">
                  {program.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group lg:pr-10"
            >
              {/* Decorative blobs behind */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/30 to-brand-orange/30 rounded-[60px] blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>

              {/* Main Image Container */}
              <div className="relative z-10 w-full rounded-[48px] overflow-hidden shadow-2xl border-[10px] border-white/80 bg-white group-hover:-rotate-2 transition-transform duration-700 group-hover:scale-[1.02] aspect-[4/3]">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/20 to-transparent mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                <img
                  src="/Foto21.jpeg"
                  alt="Kegiatan PAUD Husnul Khoir"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating dots pattern */}
              <div className="absolute -top-12 -left-8 w-40 h-40 bg-[radial-gradient(#1A95C4_3px,transparent_3px)] [background-size:24px_24px] opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700 animate-pulse"></div>

              <div className="absolute -bottom-10 -right-4 w-40 h-40 bg-[radial-gradient(#F4841B_3px,transparent_3px)] [background-size:24px_24px] opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-700 animate-pulse"></div>

              {/* Decorative Floating Badge */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -right-6 md:right-0 z-20 bg-white p-4 lg:p-5 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(26,149,196,0.3)] border border-blue-50 flex items-center gap-4 group-hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(244,132,27,0.4)]"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-orange-400 rounded-[20px] flex items-center justify-center text-white shrink-0 shadow-inner rotate-3 group-hover:-rotate-6 transition-transform duration-300">
                  <Star className="w-8 h-8 fill-current text-white drop-shadow-md" />
                </div>
                <div className="pr-2">
                  <p className="text-xl lg:text-2xl font-black text-heading leading-none mb-1 tracking-tight">
                    Sekolah
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-brand-blue tracking-wide uppercase">
                    Pilihan Terbaik
                  </p>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-sm mb-6 uppercase tracking-widest">
                <Star className="w-4 h-4" />
                <span>Keunggulan Kami</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-heading mb-6 tracking-tight leading-[1.1]">
                Mengapa <br className="hidden md:block" />
                <span className="text-brand-blue relative inline-block mt-2">
                  PAUD HUSNUL KHOIR?
                  <div className="absolute -bottom-2 left-0 w-1/2 h-2 bg-brand-orange rounded-full"></div>
                </span>
              </h2>

              <div className="relative mb-10 pl-6 border-l-4 border-brand-orange/40">
                <p className="text-lg md:text-xl text-muted font-medium leading-relaxed">
                  Kami bukan sekadar sekolah, melainkan{" "}
                  <span className="font-bold text-brand-blue">
                    lingkungan kedua
                  </span>{" "}
                  bagi anak Anda. Dengan dedikasi tinggi, pendidik kami
                  memastikan setiap anak dapat mengembangkan bakat uniknya
                  secara bebas dan terarah.
                </p>
              </div>

              <ul className="space-y-6 mb-10">
                <motion.li
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-start gap-5 p-5 rounded-[28px] bg-white shadow-[0_10px_30px_-15px_rgba(26,149,196,0.1)] border border-blue-50/50 hover:border-brand-blue/30 hover:shadow-[0_15px_40px_-15px_rgba(26,149,196,0.2)] cursor-pointer group transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-blue/10 to-transparent rounded-[18px] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    <Shield className="w-7 h-7 text-brand-blue group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-heading text-xl mb-1 group-hover:text-brand-blue transition-colors">
                      Keamanan & Kenyamanan
                    </h4>
                    <p className="text-muted font-medium leading-relaxed">
                      Fasilitas yang ramah anak, diawasi secara penuh dengan
                      staf terlatih.
                    </p>
                  </div>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-start gap-5 p-5 rounded-[28px] bg-white shadow-[0_10px_30px_-15px_rgba(244,132,27,0.1)] border border-orange-50/50 hover:border-brand-orange/30 hover:shadow-[0_15px_40px_-15px_rgba(244,132,27,0.2)] cursor-pointer group transition-all duration-300 relative overflow-hidden"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-orange/10 to-transparent rounded-[18px] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
                    <Star className="w-7 h-7 text-brand-orange group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-bold text-heading text-xl mb-1 group-hover:text-brand-orange transition-colors">
                      Fokus pada Minat Anak
                    </h4>
                    <p className="text-muted font-medium leading-relaxed">
                      Anak diberikan kebebasan bereksplorasi di berbagai sentra
                      sesuai minat.
                    </p>
                  </div>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-start gap-5 p-5 rounded-[28px] bg-white shadow-[0_10px_30px_-15px_rgba(26,149,196,0.1)] border border-blue-50/50 hover:border-brand-blue/30 hover:shadow-[0_15px_40px_-15px_rgba(26,149,196,0.2)] cursor-pointer group transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-blue/10 to-transparent rounded-[18px] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    <Smile className="w-7 h-7 text-brand-blue group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-heading text-xl mb-1 group-hover:text-brand-blue transition-colors">
                      Pendampingan Psikologis
                    </h4>
                    <p className="text-muted font-medium leading-relaxed">
                      Bekerja sama dengan praktisi psikologi anak untuk memantau
                      tumbuh kembang.
                    </p>
                  </div>
                </motion.li>
              </ul>

              <Link
                to="/profile"
                className="inline-flex items-center gap-2 text-brand-orange font-extrabold text-lg hover:text-brand-blue transition-colors group"
                onClick={() => window.scrollTo(0, 0)}
              >
                Pelajari Profil Lebih Lanjut
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden text-white text-center bg-gradient-to-br from-sky-400 via-[#38BDF8] to-blue-500">
        {/* Animated Background Elements */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"
        />

        {/* Floating clouds/shapes to give sky-ocean feeling */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] opacity-20 pointer-events-none"
        >
          <svg width="120" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 19c-2.48 0-4.5-2.02-4.5-4.5 0-.25.02-.5.06-.74A5.498 5.498 0 0 0 14 11.5c0-3.03-2.47-5.5-5.5-5.5S3 8.47 3 11.5c0 1.94 1 3.65 2.5 4.58C5.18 16.4 5 16.93 5 17.5 5 19.43 6.57 21 8.5 21h9c1.93 0 3.5-1.57 3.5-3.5 0-1.78-1.34-3.26-3.07-3.47.04-.34.07-.68.07-1.03 0-2.48-2.02-4.5-4.5-4.5S9 10.52 9 13v1c0 .5-.4.9-1 .8-1.52-.3-2.5-1.54-2.5-2.8C5.5 10.34 6.84 9 8.5 9c1.38 0 2.56.96 2.87 2.27.12.5.6.82 1.11.7.5-.12.83-.6.7-1.11A5.485 5.485 0 0 0 8.5 7 7.5 7.5 0 0 0 1 11.5C1 14.86 3.25 17.65 6.3 18.6 6.82 20.57 8.56 22 10.5 22h7c2.48 0 4.5-2.02 4.5-4.5S19.98 13 17.5 13c-.22 0-.44.02-.65.05.09-.49.15-1.01.15-1.55 0-3.86-3.14-7-7-7s-7 3.14-7 7v1H2v-1c0-4.97 4.03-9 9-9s9 4.03 9 9c0 .7-.08 1.38-.23 2.03C21.36 15.11 23 16.86 23 19c0 2.48-2.02 4.5-4.5 4.5zm0-2z" />
          </svg>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight drop-shadow-md"
          >
            Mari Bergabung <br />
            Keluarga Besar HUSNUL KHOIR
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-sky-50 font-medium mb-12 max-w-2xl mx-auto drop-shadow-sm"
          >
            Daftarkan putra-putri Anda untuk tahun ajaran baru. Berikan mereka
            pengalaman belajar terbaik yang menyenangkan di usia emas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Link
              to="/contact"
              className="px-6 py-3 bg-[#F57C00] hover:bg-[#E65100] text-white font-extrabold rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-base border-2 border-[#F57C00] hover:border-[#E65100]"
              onClick={() => window.scrollTo(0, 0)}
            >
              Hubungi Kami Sekarang
            </Link>
            <Link
              to="/gallery/kegiatan"
              className="px-6 py-3 bg-white/10 backdrop-blur-md border-2 border-white text-white font-extrabold rounded-full hover:bg-white hover:text-sky-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 text-base"
              onClick={() => window.scrollTo(0, 0)}
            >
              Lihat Galeri Kegiatan
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
