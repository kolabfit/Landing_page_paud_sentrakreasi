import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Award,
  ShieldCheck,
} from "lucide-react";
import { useCmsSettings } from "../lib/useCmsSettings";

export default function Hero() {
  const { settings } = useCmsSettings();
  const siteName = settings?.site_name || "PAUD HUSNUL KHOIR";
  const siteTagline = settings?.site_tagline || "Pendidikan Karakter Modern";

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex-1 bg-gradient-to-b from-brand-light to-white">
      {/* Decorative background shapes */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-blue rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-white text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm border border-border-light">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                {siteTagline}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-heading tracking-tight leading-[1.1]">
              Tumbuh &<br />
              Berkembang di
              <br />
              <span className="text-gradient uppercase">{siteName}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted leading-relaxed max-w-xl font-medium">
              Kami menghadirkan lingkungan belajar yang ceria, islami, dan
              modern. Membimbing putra-putri Anda untuk bereksplorasi, menemukan
              potensi terbaiknya, dan membangun karakter mulia sejak usia emas.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/profile"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-gradient-orange text-white rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Jelajahi Profil PAUD
              </Link>
              <Link
                to="/news"
                className="inline-flex justify-center items-center px-8 py-4 bg-brand-light text-brand-blue hover:bg-blue-100 rounded-full font-bold transition-colors shadow-sm"
              >
                Lihat Berita
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 lg:mt-0 relative"
          >
            <div className="relative aspect-[4/3] rounded-[40px] group">
              <div className="absolute inset-0 bg-brand-orange rounded-[40px] rotate-[-3deg] opacity-10 group-hover:rotate-[-6deg] transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-brand-blue rounded-[40px] rotate-[3deg] opacity-10 group-hover:rotate-[6deg] transition-transform duration-500"></div>
              <div className="relative h-full w-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="/Foto1.jpeg"
                  alt="Anak-anak belajar dan bermain"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="absolute top-8 -left-6 bg-white p-4 rounded-[24px] shadow-lg border border-border-light hidden md:flex items-center gap-3 z-10"
              >
                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex justify-center items-center text-2xl">
                  🎨
                </div>
                <div>
                  <p className="text-xs text-muted font-bold">Fokus Utama</p>
                  <p className="text-sm font-bold text-heading">Kreativitas</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute bottom-12 -right-6 bg-white p-4 rounded-[24px] shadow-lg border border-border-light hidden md:flex items-center gap-3 z-10"
              >
                <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex justify-center items-center text-2xl">
                  🧸
                </div>
                <div>
                  <p className="text-xs text-muted font-bold">Lingkungan</p>
                  <p className="text-sm font-bold text-heading">Ramah Anak</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section moved below Hero for centering, larger size, and without orange */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white p-6 md:p-8 lg:p-10 rounded-[32px] shadow-[0_10px_40px_-15px_rgba(26,149,196,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(26,149,196,0.2)] border border-blue-50/80 flex flex-col items-center justify-center cursor-default transition-all duration-500 group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-[40px] opacity-60 transition-transform duration-500 group-hover:scale-125"></div>
              <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 flex items-center justify-center mb-5 md:mb-6 text-brand-blue group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                <Calendar className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h4 className="relative z-10 text-4xl lg:text-5xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-500 group-hover:scale-110 transition-transform duration-500">
                15+
              </h4>
              <p className="relative z-10 text-sm md:text-[15px] text-[#546E7A] font-semibold mt-3 md:mt-4 leading-relaxed tracking-wide text-center">
                Tahun
                <br />
                Pengalaman
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white p-6 md:p-8 lg:p-10 rounded-[32px] shadow-[0_10px_40px_-15px_rgba(244,132,27,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(244,132,27,0.2)] border border-orange-50/80 flex flex-col items-center justify-center cursor-default transition-all duration-500 group overflow-hidden relative"
            >
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-50 to-transparent rounded-tr-[40px] opacity-60 transition-transform duration-500 group-hover:scale-125"></div>
              <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 flex items-center justify-center mb-5 md:mb-6 text-brand-orange group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h4 className="relative z-10 text-4xl lg:text-5xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400 group-hover:scale-110 transition-transform duration-500">
                500+
              </h4>
              <p className="relative z-10 text-sm md:text-[15px] text-[#546E7A] font-semibold mt-3 md:mt-4 leading-relaxed tracking-wide text-center">
                Siswa
                <br />
                Aktif
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white p-6 md:p-8 lg:p-10 rounded-[32px] shadow-[0_10px_40px_-15px_rgba(26,149,196,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(26,149,196,0.2)] border border-blue-50/80 flex flex-col items-center justify-center cursor-default transition-all duration-500 group overflow-hidden relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-60 transition-transform duration-500 group-hover:scale-125"></div>
              <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 flex items-center justify-center mb-5 md:mb-6 text-brand-blue group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                <Award className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h4 className="relative z-10 text-4xl lg:text-5xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-500 group-hover:scale-110 transition-transform duration-500">
                30+
              </h4>
              <p className="relative z-10 text-sm md:text-[15px] text-[#546E7A] font-semibold mt-3 md:mt-4 leading-relaxed tracking-wide text-center">
                Guru
                <br />
                Tersertifikasi
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white p-6 md:p-8 lg:p-10 rounded-[32px] shadow-[0_10px_40px_-15px_rgba(244,132,27,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(244,132,27,0.2)] border border-orange-50/80 flex flex-col items-center justify-center cursor-default transition-all duration-500 group overflow-hidden relative"
            >
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-gradient-to-tl from-orange-50 to-transparent rounded-full opacity-60 transition-transform duration-500 group-hover:scale-125"></div>
              <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 flex items-center justify-center mb-5 md:mb-6 text-brand-orange group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <ShieldCheck className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h4 className="relative z-10 text-4xl lg:text-5xl leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400 group-hover:scale-110 transition-transform duration-500">
                100%
              </h4>
              <p className="relative z-10 text-sm md:text-[15px] text-[#546E7A] font-semibold mt-3 md:mt-4 leading-relaxed tracking-wide text-center">
                Lingkungan
                <br />
                Aman
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
