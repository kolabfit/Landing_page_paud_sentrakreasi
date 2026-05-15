import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { CmsPageDetail, getPages } from '../lib/cms';

function extractImageUrl(field: any): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field.url || field.src || field.image_url || "";
  }
  return "";
}

const galleryData = {
  kegiatan: [
    {
      url: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1200&h=675&auto=format&fit=crop',
      alt: 'Mendengarkan cerita bersama guru'
    },
    {
      url: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1200&h=675&auto=format&fit=crop',
      alt: 'Eksplorasi warna dan seni lukis'
    },
    {
      url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200&h=675&auto=format&fit=crop',
      alt: 'Interaksi hangat guru dan murid'
    },
    {
      url: 'https://images.unsplash.com/photo-1544365391-825dec92eec4?q=80&w=1200&h=675&auto=format&fit=crop',
      alt: 'Kegiatan bermain peran dan kolaborasi'
    },
    {
      url: 'https://images.unsplash.com/photo-1587654062353-8326a6358dbb?q=80&w=1200&h=675&auto=format&fit=crop',
      alt: 'Belajar kelompok yang menyenangkan'
    },
    {
      url: 'https://images.unsplash.com/photo-1540479859204-7c5ff6f66398?q=80&w=1200&h=675&auto=format&fit=crop',
      alt: 'Aktivitas motorik di area bermain'
    },
    {
      url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&h=675&auto=format&fit=crop',
      alt: 'Eksperimen sains sederhana untuk anak'
    },
    {
      url: 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?q=80&w=1200&h=675&auto=format&fit=crop',
      alt: 'Bimbingan personal dari pengajar'
    }
  ],
  sarana: [
    {
      url: '/Sarana Prasarana/Taman Bacaan.jpeg',
      alt: 'Taman Bacaan'
    },
    {
      url: '/Sarana Prasarana/Halaman Bermain.jpeg',
      alt: 'Halaman Bermain'
    },
    {
      url: '/Sarana Prasarana/Jembatan Titian.jpeg',
      alt: 'Jembatan Titian'
    },
    {
      url: '/Sarana Prasarana/Lorong Spiral.jpeg',
      alt: 'Lorong Spiral'
    },
    {
      url: '/Sarana Prasarana/Terowongan.jpeg',
      alt: 'Terowongan'
    }
  ]
};

export default function Gallery() {
  const { category } = useParams();
  
  if (!category) {
    return <Navigate to="/gallery/kegiatan" replace />;
  }

  const activeCategory = category;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cmsImages, setCmsImages] = useState<{url: string, alt: string}[] | null>(null);
  const [pageData, setPageData] = useState<{title: string, description: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset index when category changes
    setCurrentIndex(0);
    setIsLoading(true);
    
    let isMounted = true;
    getPages().then((pages) => {
      if (!isMounted) return;
      const allPages = pages as CmsPageDetail[];
      const targetSlug1 = `galeri-${activeCategory}`.toLowerCase();
      const targetSlug2 = `gallery-${activeCategory}`.toLowerCase();
      
      // Try category specific slug first, e.g. "galeri-sarana" or "galeri-kegiatan"
      let match = allPages.find(p => p.slug.toLowerCase() === targetSlug1 || p.slug.toLowerCase() === targetSlug2);
      
      // Fallback to general "galeri"
      if (!match) {
        match = allPages.find(p => p.slug.toLowerCase() === 'galeri' || p.slug.toLowerCase() === 'gallery');
      }

      if (match && match.content) {
        setPageData({
          title: match.title,
          description: ((match.content.find(b => b.type === 'hero')?.data as any)?.sub_headline) || ""
        });
        const extracted: {url: string, alt: string}[] = [];
        match.content.forEach(block => {
          if (block.type === 'gallery' || block.type === 'image-gallery') {
            const data = (block.data as any) || {};
            const imagesArray = (Array.isArray(data) ? data : (data.images || data.items || data.gallery || [])) as any[];
            imagesArray.forEach(img => {
              const src = extractImageUrl(img.image) || extractImageUrl(img.url) || extractImageUrl(img.src) || extractImageUrl(img.photo_url) || extractImageUrl(img.photo) || extractImageUrl(img);
              if (src) {
                const alt = (img.alt ?? img.caption ?? img.title ?? data.title ?? "") as string;
                extracted.push({ url: src, alt });
              }
            });
          }
        });
        if (extracted.length > 0) setCmsImages(extracted);
        else setCmsImages(null);
      } else {
        setCmsImages(null);
        setPageData(null);
      }
    }).catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeCategory]);

  const fallbackData = galleryData[activeCategory as keyof typeof galleryData] || [];
  const galleryImages = cmsImages && cmsImages.length > 0 ? cmsImages : fallbackData;

  useEffect(() => {
    if (galleryImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [galleryImages.length]);

  const nextSlide = () => {
    if (galleryImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    if (galleryImages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const getRelativePosition = (index: number) => {
    const total = galleryImages.length;
    let diff = index - currentIndex;
    if (diff > Math.floor(total / 2)) diff -= total;
    if (diff < -Math.floor(total / 2)) diff += total;
    return diff;
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
        <h3 className="text-2xl font-black text-brand-blue mb-3 z-10 tracking-tight">Memuat Galeri...</h3>
        <p className="text-muted font-medium text-center max-w-xs z-10 leading-relaxed">
          Tunggu sebentar, kami sedang menyusun momen-momen indah di sekolah.
        </p>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-24 bg-white min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-heading mb-6"
          >
            {pageData?.title ? pageData.title : (activeCategory === 'kegiatan' ? "Galeri Kegiatan Interaktif" : "Galeri Sarana Prasarana")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted leading-relaxed font-medium mb-10"
          >
            {pageData?.description ? pageData.description : (activeCategory === 'kegiatan' 
              ? "Intip keseruan momen belajar dan berkreasi anak-anak di lingkungan PAUD Husnul Khoir setiap harinya. Setiap gambar adalah cerita tentang pertumbuhan, eksperimen, memecahkan masalah, dan eksplorasi jati diri dengan senyuman."
              : "Jelajahi berbagai fasilitas dan sarana prasarana yang kami sediakan untuk mendukung proses belajar mengajar dan bermain anak yang aman, nyaman, dan menyenangkan.")}
          </motion.p>
        </div>

        <div className="relative w-full h-[300px] md:h-[460px] flex items-center justify-center">
          {galleryImages.map((img, index) => {
            const relPos = getRelativePosition(index);
            const isCenter = relPos === 0;
            const absPos = Math.abs(relPos);
            
            // Only render items within +/- 3 distance
            if (absPos > 3) return null;

            return (
              <motion.div
                key={index}
                className="absolute w-[320px] md:w-[680px] h-[200px] md:h-[380px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl cursor-pointer bg-white border border-border-light/50"
                initial={false}
                animate={{
                  x: `${relPos * 80}%`,
                  scale: isCenter ? 1 : Math.max(1 - absPos * 0.15, 0.5),
                  zIndex: 20 - absPos,
                  opacity: isCenter ? 1 : Math.max(1 - absPos * 0.3, 0.2),
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <h3 className={`font-bold drop-shadow-md transition-all duration-500 line-clamp-2 ${isCenter ? 'text-2xl opacity-100 translate-y-0' : 'text-sm opacity-0 translate-y-4'}`}>
                    {img.alt}
                  </h3>
                </div>

                {!isCenter && (
                  <div className="absolute inset-0 bg-black/20 transition-opacity"></div>
                )}
              </motion.div>
            );
          })}

          <button 
            onClick={prevSlide}
            className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-heading hover:bg-white transition-colors shadow-sm focus:outline-none z-50 group border border-border-light/50"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-heading hover:bg-white transition-colors shadow-sm focus:outline-none z-50 group border border-border-light/50"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        
        <div className="flex justify-center mt-12 gap-2">
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-brand-blue' : 'w-2 bg-border-light hover:bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
