import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send, CheckCircle2, Globe, Facebook } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { getPages, CmsPageDetail } from '../lib/cms';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cmsPage, setCmsPage] = useState<CmsPageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPages()
      .then((items) => {
        if (!isMounted) return;
        const match = (items as CmsPageDetail[]).find(
          (item) => item.slug.toLowerCase() === 'kontak' || item.title.toLowerCase() === 'kontak'
        );
        if (match) {
          setCmsPage(match);
        }
      })
      .catch((err) => {
        console.error("Failed to load CMS kontak page:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center relative overflow-hidden pt-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-brand-orange/5 rounded-full blur-2xl"></div>
        <div className="relative w-32 h-32 mb-8 z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-orange/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-4 bg-brand-blue/10 rounded-full animate-pulse"></div>
          <div className="relative bg-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center border-4 border-blue-50 z-20">
            <div className="w-8 h-8 border-4 border-brand-orange border-t-brand-blue rounded-full animate-spin"></div>
          </div>
        </div>
        <h3 className="text-2xl font-black text-brand-blue mb-3 z-10 tracking-tight">Memuat Kontak...</h3>
        <p className="text-muted font-medium text-center max-w-xs z-10 leading-relaxed">
          Tunggu sebentar, kami sedang menyiapkan informasi kontak sekolah.
        </p>
      </div>
    );
  }

  const heroBlock = cmsPage?.content?.find((b) => b.type === 'hero')?.data as any;
  const contactsBlock = cmsPage?.content?.find((b) => b.type === 'contacts')?.data as any;

  const headline = heroBlock?.headline || "Pintu Kami";
  const headlineWords = headline.split(" ");
  const headlineFirstPart = headlineWords.slice(0, Math.floor(headlineWords.length / 2)).join(" ");
  const headlineSecondPart = headlineWords.slice(Math.floor(headlineWords.length / 2)).join(" ");
  const subHeadline = heroBlock?.sub_headline || "Memiliki pertanyaan mengenai program pendaftaran, rincian biaya, metode pembelajaran, fasilitas sekolah, atau ingin berkunjung langsung untuk melihat suasana kelas kami? Jangan ragu untuk menghubungi.";

  const address = contactsBlock?.addresses?.[0] || "Jalan Raya Banjaran KM 14, Kp. Sepen RT 05/ RW 06 Desa Sukasari, Kec. Pameungpeuk Kab. Bandung, 40376";
  const phone = contactsBlock?.phone_numbers?.[0] || "08121425046 / 088218188118";
  const email = contactsBlock?.emails?.[0] || "info@husnulkhoir.sch.id";
  
  const socialLinks = contactsBlock?.social_links || [];
  const websiteObj = socialLinks.find((s: any) => s.platform.toLowerCase() === 'website');
  const facebookObj = socialLinks.find((s: any) => s.platform.toLowerCase() === 'facebook');
  
  const websiteUrl = websiteObj?.url;
  const websiteText = websiteUrl ? websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : "";
  const facebookUrl = facebookObj?.url;
  const facebookText = facebookUrl ? facebookUrl.replace(/^https?:\/\/(www\.)?facebook\.com\//i, '').replace(/\/$/, '') : "";

  return (
    <section className="pt-32 pb-24 bg-brand-light relative overflow-hidden min-h-screen">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-brand-orange/10 to-transparent rounded-bl-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-tr-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] -z-10 pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-sm mb-6 uppercase tracking-widest border border-brand-blue/10">
              <Mail className="w-4 h-4" />
              <span>Hubungi Kami</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-6 tracking-tight leading-[1.1]">
              {headlineFirstPart} <br className="hidden md:block"/>
              <span className="text-brand-orange relative inline-block mt-2">
                {headlineSecondPart}
                <div className="absolute -bottom-2 left-0 w-1/2 h-2 bg-brand-orange/30 rounded-full"></div>
              </span>
            </h2>
            <div className="relative mb-12 pl-6 border-l-4 border-brand-blue/40">
              <p className="text-lg md:text-xl text-muted leading-relaxed font-medium">
                {subHeadline}
              </p>
            </div>

            <div className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-start gap-5 p-6 rounded-[28px] bg-white shadow-[0_10px_30px_-15px_rgba(26,149,196,0.1)] border border-blue-50/50 hover:border-brand-blue/30 hover:shadow-[0_15px_40px_-15px_rgba(26,149,196,0.2)] group transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-brand-blue/10 to-transparent rounded-[18px] flex items-center justify-center text-brand-blue shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  <MapPin className="w-7 h-7 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-heading mb-1 group-hover:text-brand-blue transition-colors">Alamat Sekolah</h4>
                  <p className="text-muted text-base font-medium leading-relaxed">
                    {address}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-start gap-5 p-6 rounded-[28px] bg-white shadow-[0_10px_30px_-15px_rgba(244,132,27,0.1)] border border-orange-50/50 hover:border-brand-orange/30 hover:shadow-[0_15px_40px_-15px_rgba(244,132,27,0.2)] group transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-brand-orange/10 to-transparent rounded-[18px] flex items-center justify-center text-brand-orange shrink-0 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
                  <Phone className="w-7 h-7 group-hover:text-orange-500 transition-colors" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-heading mb-1 group-hover:text-brand-orange transition-colors">Telepon & WhatsApp</h4>
                  <p className="text-muted text-base mt-1 font-medium">{phone}</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-start gap-5 p-6 rounded-[28px] bg-white shadow-[0_10px_30px_-15px_rgba(26,149,196,0.1)] border border-blue-50/50 hover:border-brand-blue/30 hover:shadow-[0_15px_40px_-15px_rgba(26,149,196,0.2)] group transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-brand-blue/10 to-transparent rounded-[18px] flex items-center justify-center text-brand-blue shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  <Mail className="w-7 h-7 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-heading mb-1 group-hover:text-brand-blue transition-colors">Email</h4>
                  <p className="text-muted text-base mt-1 font-medium">{email}</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-6">
                {websiteUrl && (
                  <motion.div 
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-4 p-5 rounded-[24px] bg-white shadow-[0_10px_30px_-15px_rgba(244,132,27,0.1)] border border-orange-50/50 hover:border-brand-orange/30 group transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-orange/10 to-transparent rounded-[16px] flex items-center justify-center text-brand-orange shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-6 h-6 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-bold text-heading mb-0.5 group-hover:text-brand-orange transition-colors">Website</h4>
                      <a href={websiteUrl} target="_blank" rel="noreferrer" className="text-brand-orange text-sm font-medium break-all hover:underline">{websiteText}</a>
                    </div>
                  </motion.div>
                )}

                {facebookUrl && (
                  <motion.div 
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-4 p-5 rounded-[24px] bg-white shadow-[0_10px_30px_-15px_rgba(26,149,196,0.1)] border border-blue-50/50 hover:border-brand-blue/30 group transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-blue/10 to-transparent rounded-[16px] flex items-center justify-center text-brand-blue shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Facebook className="w-6 h-6 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-bold text-heading mb-0.5 group-hover:text-brand-blue transition-colors">Facebook</h4>
                      <a href={facebookUrl} target="_blank" rel="noreferrer" className="text-brand-blue text-sm font-medium hover:underline break-all">{facebookText}</a>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>


          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_-15px_rgba(26,149,196,0.15)] border-[8px] border-white/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-black text-heading mb-8 tracking-tight">
                Kirim Pesan <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-500">Langsung</span>
              </h3>
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 border border-brand-orange/30 text-brand-orange p-8 rounded-[24px] flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
                    <CheckCircle2 className="w-10 h-10 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black mb-2 text-heading">Berhasil Terkirim!</h4>
                    <p className="text-base font-medium text-muted">Terima kasih telah menghubungi kami. Kami akan segera merespon pesan Anda melalui email.</p>
                  </div>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-heading mb-2 ml-1">Nama Lengkap Orang Tua</label>
                      <input 
                        type="text" 
                        id="name"
                        required
                        className="w-full px-5 py-4 rounded-[20px] border border-blue-50 bg-brand-light focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-base font-medium shadow-inner"
                        placeholder="Mis. Andini Larasati"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-heading mb-2 ml-1">Alamat Email Aktif</label>
                      <input 
                        type="email" 
                        id="email"
                        required
                        className="w-full px-5 py-4 rounded-[20px] border border-blue-50 bg-brand-light focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-base font-medium shadow-inner"
                        placeholder="anda@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-heading mb-2 ml-1">Topik Pesan / Pertanyaan</label>
                      <textarea 
                        id="message"
                        required
                        rows={4}
                        className="w-full px-5 py-4 rounded-[20px] border border-blue-50 bg-brand-light focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all resize-none text-base font-medium shadow-inner"
                        placeholder="Ceritakan pertanyaan Anda dengan detail di sini..."
                      ></textarea>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 text-white bg-brand-orange hover:bg-orange-500 rounded-[20px] font-bold transition-all duration-300 flex items-center justify-center gap-3 mt-8 shadow-[0_10px_20px_-10px_rgba(244,132,27,0.4)] hover:shadow-[0_15px_25px_-10px_rgba(244,132,27,0.5)] hover:-translate-y-1 text-lg group"
                  >
                    Kirim Pesan Sekarang
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
