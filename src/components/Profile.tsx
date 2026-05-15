import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, Heart, GraduationCap, CheckCircle2, Star, 
  Users, MapPin, Calendar, BookOpen, Music, 
  Smile, ShieldCheck, Zap, Award
} from 'lucide-react';
import { CmsPageDetail, getPages } from '../lib/cms';
import { CmsContentBlock } from './PageDetail';

function extractImageUrl(field: any): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field.url || field.src || field.image_url || "";
  }
  return "";
}

function ProfileBlockRenderer({ block }: { block: CmsContentBlock }) {
  const data = block?.data as Record<string, unknown> | undefined;
  if (!data) return null;

  // ── HERO BLOCK ──
  if (block.type === "hero") {
    const headline = (data.headline ?? "") as string;
    const subHeadline = (data.sub_headline ?? "") as string;
    const backgroundImage = extractImageUrl(data.background_image) || extractImageUrl(data.background_image_url) || "";
    
    // Auto-highlight logic like static UI (highlighting "Penuh Warna" if it exists, or last 2 words)
    let highlightedHeadline = <>{headline}</>;
    if (headline) {
      const words = headline.split(' ');
      if (words.length >= 3) {
        const lastTwo = words.splice(-2).join(' ');
        highlightedHeadline = <>{words.join(' ')} <span className="text-brand-orange">{lastTwo}</span></>;
      }
    }

    return (
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-heading mb-8 tracking-tight">
              {highlightedHeadline}
            </h1>
            <p className="text-xl text-muted leading-relaxed mb-12 max-w-3xl mx-auto">
              {subHeadline}
            </p>
            
            {backgroundImage && (
              <div className="relative rounded-[50px] overflow-hidden shadow-2xl aspect-[16/7] group">
                <img 
                  src={backgroundImage} 
                  alt={headline} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
      </section>
    );
  }

  // ── PROFILE TABS / STATS BLOCK ──
  if (block.type === "profile-tabs" || block.type === "stats") {
    const tabs = (data.tabs || data.items || []) as any[];
    return (
      <section className="py-16 relative z-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 w-full max-w-6xl">
              {tabs.map((tab, index) => {
                const label = tab.label || tab.title || "";
                const valueHtml = tab.content || tab.value || "";
                const valueStr = valueHtml.replace(/<[^>]*>?/gm, ''); // strip html
                const Icons = [Calendar, Users, Star, MapPin];
                const Icon = Icons[index % 4];
                return (
                  <div key={index} className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl text-center group hover:bg-brand-blue transition-all duration-400 cursor-default">
                    <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue mx-auto mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-3xl font-black text-heading group-hover:text-white transition-colors">{valueStr}</div>
                    <div className="text-xs text-muted uppercase tracking-wider font-bold mt-2 group-hover:text-white/80 transition-colors">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── TEAM BLOCK ──
  if (block.type === "team") {
    const members = (data.members || []) as any[];
    const title = (data.title ?? "Tim Pengajar") as string;
    const subtitle = (data.subtitle ?? "") as string;
    
    // Auto-highlight logic for "Dipandu Oleh Hati"
    let highlightedTitle = <>{title}</>;
    if (title.toLowerCase().includes("hati")) {
      const parts = title.split(/hati/i);
      highlightedTitle = <>{parts[0]} <span className="text-brand-blue italic underline decoration-wavy">Hati</span> {parts[1]}</>;
    }

    return (
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-heading mb-6 tracking-tight">{highlightedTitle}</h2>
            {subtitle && <p className="text-muted text-lg max-w-2xl mx-auto">{subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {members.map((teacher, idx) => {
              const photo = extractImageUrl(teacher.photo_url) || extractImageUrl(teacher.photo) || extractImageUrl(teacher.image);
              return (
                <div key={idx} className="bg-white rounded-[32px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-shadow duration-400 group overflow-hidden">
                  <div className="rounded-[24px] overflow-hidden mb-8 aspect-square relative">
                    {photo ? (
                      <img src={photo} alt={teacher.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center"><Users size={64} className="text-brand-blue/20"/></div>
                    )}
                    <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="px-6 pb-6 text-center">
                    <h4 className="text-2xl font-black text-heading mb-2 leading-tight">{teacher.name}</h4>
                    <p className="text-brand-blue font-bold px-4 py-1 bg-brand-blue/10 rounded-full inline-block text-sm">{teacher.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ── FEATURES BLOCK ──
  if (block.type === "features") {
    const items = (data.items || []) as any[];
    const title = (data.title ?? "") as string;
    const subtitle = (data.subtitle ?? "") as string;
    
    // Large Grid (Dedikasi Kami / Fasilitas)
    if (items.length > 4 || title.toLowerCase().includes('dedikasi')) {
      const Icons = [Palette, Star, Heart, GraduationCap, Palette, Heart, Calendar, GraduationCap];
      return (
        <section className="py-24 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-heading mb-4">{title}</h2>
              {subtitle && <p className="text-muted text-lg max-w-2xl mx-auto">{subtitle}</p>}
            </div>
            <div className={`grid grid-cols-2 ${items.length <= 6 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4 md:gap-8 text-center`}>
              {items.map((feature, idx) => {
                const colorClass = ["bg-brand-blue", "bg-brand-orange", "bg-blue-500", "bg-orange-500"][idx % 4];
                const Icon = Icons[idx % Icons.length];
                return (
                  <div key={idx} className="bg-white p-6 md:p-10 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all duration-400 flex flex-col items-center group hover:-translate-y-2">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${colorClass} rounded-full flex items-center justify-center text-white mb-6 shadow-lg group-hover:rotate-12 transition-transform`}>
                      <Icon className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-heading mb-3 leading-tight px-2">{feature.title}</h3>
                    <p className="text-muted text-xs md:text-sm leading-relaxed font-medium">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    } else {
      // Small Grid (Kurikulum / Sentra)
      return (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-sm mb-8 uppercase tracking-widest border border-brand-orange/20 shadow-sm">
              <Award className="w-5 h-5" />
              <span>{title}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
              {items.map((curr, idx) => {
                const iconBg = ["bg-orange-500", "bg-pink-500", "bg-blue-500", "bg-green-500"][idx % 4];
                const Icons = [BookOpen, Palette, Zap, Heart];
                const Icon = Icons[idx % Icons.length];
                return (
                  <div key={idx} className="group flex flex-col md:flex-row gap-6 items-start p-8 md:p-10 bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 cursor-pointer">
                    <div className={`w-16 h-16 md:w-20 md:h-20 ${iconBg} rounded-[20px] md:rounded-[28px] flex-shrink-0 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-400`}>
                      <Icon className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div>
                      <h4 className="font-black text-heading text-xl md:text-2xl mb-3 group-hover:text-brand-blue transition-colors duration-400">{curr.title}</h4>
                      <p className="text-base md:text-lg text-muted leading-relaxed font-medium">{curr.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }
  }

  // ── GALLERY BLOCK ──
  if (block.type === "gallery" || block.type === "image-gallery") {
    const imagesArray = (Array.isArray(data) ? data : (data.images || data.items || data.gallery || [])) as any[];
    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
      const title = (!Array.isArray(data) ? (data.title ?? data.heading ?? "") : "") as string;
      const subtitle = (!Array.isArray(data) ? (data.subtitle ?? data.description ?? "") : "") as string;
      return (
        <section className="py-24 bg-brand-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(title || subtitle) && (
              <div className="text-center mb-16 max-w-3xl mx-auto">
                {title && <h2 className="text-4xl md:text-6xl font-black text-heading mb-6 tracking-tight">{title}</h2>}
                {subtitle && <p className="text-muted text-lg font-medium">{subtitle}</p>}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {imagesArray.map((img, idx) => {
                const src = extractImageUrl(img.image) || extractImageUrl(img.url) || extractImageUrl(img.src) || extractImageUrl(img.photo_url) || extractImageUrl(img.photo) || extractImageUrl(img) || "";
                const alt = (img.alt ?? img.caption ?? img.title ?? "") as string;
                if (!src) return null;
                return (
                  <div key={idx} className="relative rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group aspect-square border-[6px] border-white bg-white">
                    <img src={src} alt={alt || `Gallery image ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    {alt && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                        <p className="text-white text-lg font-bold drop-shadow-md">{alt}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }
  }

  // ── RICH TEXT BLOCK ──
  if (block.type === "rich-text") {
    const content = (data.content ?? "") as string;
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div 
              className="text-slate-700 leading-relaxed max-w-none text-lg md:text-xl
                         [&>h1]:text-4xl [&>h1]:md:text-5xl [&>h1]:font-black [&>h1]:text-heading [&>h1]:tracking-tight [&>h1]:mb-6 [&>h1]:mt-10
                         [&>h2]:text-3xl [&>h2]:md:text-4xl [&>h2]:font-black [&>h2]:text-heading [&>h2]:tracking-tight [&>h2]:mb-4 [&>h2]:mt-8
                         [&>h3]:text-2xl [&>h3]:md:text-3xl [&>h3]:font-black [&>h3]:text-heading [&>h3]:mb-4 [&>h3]:mt-6
                         [&>p]:text-muted [&>p]:mb-6
                         [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:marker:text-brand-orange
                         [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:marker:text-brand-orange
                         [&_strong]:text-brand-orange [&_strong]:font-black
                         [&_em]:font-bold [&_em]:text-brand-blue [&_em]:not-italic
                         [&_img]:rounded-[32px] [&_img]:shadow-xl [&_img]:my-8 [&_img]:w-full"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </div>
        </div>
      </section>
    );
  }

  // Fallback for standard image
  if (block.type === "image" || block.type === "media") {
    const src = extractImageUrl(data.image) || extractImageUrl(data) || (data.url ?? data.src ?? data.image_url ?? "") as string;
    if (!src) return null;
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <img src={src} className="w-full max-w-4xl rounded-[40px] shadow-xl border-8 border-brand-light mx-auto" alt="CMS Media" referrerPolicy="no-referrer" />
        </div>
      </section>
    );
  }

  return null;
}

const stats = [
  { label: 'Tahun Berdiri', value: '2011', icon: Calendar },
  { label: 'Siswa Aktif', value: '150+', icon: Users },
  { label: 'Tenaga Pengajar', value: '12', icon: Star },
  { label: 'Lokasi Strategis', value: 'Bandung', icon: MapPin },
];

const curriculums = [
  {
    title: "Sentra Persiapan",
    desc: "Fokus pada pengenalan huruf, angka, dan persiapan kognitif dasar melalui permainan.",
    icon: BookOpen,
    color: "bg-orange-500"
  },
  {
    title: "Sentra Seni & Kreativitas",
    desc: "Eksplorasi imajinasi melalui lukis, kriya, dan berbagai media seni rupa.",
    icon: Palette,
    color: "bg-pink-500"
  },
  {
    title: "Sentra Balok",
    desc: "Membangun logika matematika dan konsep spasial melalui konstruksi.",
    icon: Zap,
    color: "bg-blue-500"
  },
  {
    title: "Sentra Ibadah",
    desc: "Penanaman nilai religius dan pembiasaan akhlak mulia sejak dini.",
    icon: Heart,
    color: "bg-green-500"
  }
];

const teachers = [
  {
    name: "Ibu Siti Aminah, S.Pd.",
    role: "Kepala Sekolah",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Ibu Rahmawati, M.Psi.",
    role: "Konselor Perkembangan",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Bapak Ahmad Fauzi",
    role: "Instruktur Kreativitas",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  }
];

const facilities = [
  { title: "Ruang Kelas Tematik", desc: "Setiap kelas dirancang sesuai dengan fokus sentra masing-masing.", icon: Smile },
  { title: "Area Bermain Indoor", desc: "Area bermain yang aman dan bersih untuk melatih motorik kasar.", icon: Zap },
  { title: "Sistem Keamanan CCTV", desc: "Pantauan keamanan 24 jam di seluruh area sekolah.", icon: ShieldCheck },
  { title: "Perpustakaan Anak", desc: "Koleksi buku cerita bergambar yang edukatif dan menarik.", icon: BookOpen },
  { title: "Studio Musik & Tari", desc: "Tempat mengasah bakat seni pertunjukan anak.", icon: Music },
  { title: "Kebun Edukasi", desc: "Area belajar bercocok tanam dan mengenal alam sekitar.", icon: Award }
];

const features = [
  {
    title: "Kreativitas Tanpa Batas",
    description: "Mendorong anak untuk mengekspresikan diri melalui seni, kriya, dan permainan imajinatif.",
    icon: Palette,
    color: "bg-brand-blue"
  },
  {
    title: "Pendekatan Holistik",
    description: "Mengembangkan aspek kognitif, motorik, sosial, dan emosional anak secara menyeluruh dan seimbang.",
    icon: Star,
    color: "bg-brand-orange"
  },
  {
    title: "Lingkungan Penuh Kasih",
    description: "Pendidik yang peduli dan suportif siap mendampingi setiap langkah tumbuh kembang anak.",
    icon: Heart,
    color: "bg-brand-blue"
  },
  {
    title: "Kesiapan Akademik",
    description: "Menanamkan literasi dan numerasi dasar sejak dini dengan metode fun learning yang interaktif.",
    icon: GraduationCap,
    color: "bg-brand-orange"
  },
  {
    title: "Metode Montessori",
    description: "Pendekatan berpusat pada anak yang menghargai keunikan dan gaya belajar masing-masing individu.",
    icon: Palette,
    color: "bg-brand-blue"
  },
  {
    title: "Nutrisi Sehat",
    description: "Menyediakan makanan sehat dan bergizi untuk menunjang tumbuh kembang fisik dan kecerdasan anak.",
    icon: Heart,
    color: "bg-brand-orange"
  },
  {
    title: "Pembelajaran Interaktif",
    description: "Memanfaatkan alat peraga dan teknologi edukasi dasar yang tepat guna untuk memancing rasa ingin tahu.",
    icon: Calendar,
    color: "bg-brand-blue"
  },
  {
    title: "Pengembangan Karakter",
    description: "Fokus pada pembentukan nilai-nilai moral, kemandirian, tanggung jawab, dan rasa empati sejak dini.",
    icon: GraduationCap,
    color: "bg-brand-orange"
  }
];

export default function Profile() {
  const [cmsPage, setCmsPage] = useState<CmsPageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPages()
      .then((items) => {
        if (!isMounted) return;
        // Find the page titled "Profil" or "Profile" or with matching slug
        const match = (items as CmsPageDetail[]).find(
          (item) => 
            item.title.toLowerCase() === "profil" || 
            item.title.toLowerCase() === "profile" || 
            item.slug.replace(/^\/+/, "").toLowerCase() === "profil" ||
            item.slug.replace(/^\/+/, "").toLowerCase() === "profile"
        );
        if (match) {
          setCmsPage(match);
        }
      })
      .catch((err) => {
        console.error("Failed to load CMS profile page:", err);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-brand-orange/5 rounded-full blur-2xl"></div>

        <div className="relative w-32 h-32 mb-8 z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-orange/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-4 bg-brand-blue/10 rounded-full animate-pulse"></div>
          <div className="relative bg-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center border-4 border-blue-50 z-20">
            <div className="w-8 h-8 border-4 border-brand-orange border-t-brand-blue rounded-full animate-spin"></div>
          </div>
        </div>
        <h3 className="text-2xl font-black text-brand-blue mb-3 z-10 tracking-tight">Memuat Profil...</h3>
        <p className="text-muted font-medium text-center max-w-xs z-10 leading-relaxed">
          Tunggu sebentar, kami sedang mengambil konten terbaru.
        </p>
      </div>
    );
  }

  if (cmsPage) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-blue/5 via-brand-blue/0 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-orange/5 via-brand-orange/0 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 pt-12">
          {/* ── Content Blocks (Hero, text, tabs, etc.) ── */}
          {contentBlocks.length > 0 && (
            <div className="flex flex-col">
              {contentBlocks.map((block, index) => (
                <motion.div 
                  key={block.id || `block-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <ProfileBlockRenderer block={block} />
                </motion.div>
              ))}
            </div>
          )}

          {/* ── CTA Banner Blocks ── */}
          {ctaBlocks.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-24 mb-10">
              {ctaBlocks.map((cta, index) => {
                const backgroundImage = extractImageUrl(cta.background_image) || extractImageUrl(cta.background_image_url) || "";
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
                    <div className="relative z-10 p-12 md:p-16 lg:w-2/3">
                      <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                        {cta.headline || "Judul belum diisi"}
                      </h2>
                      {cta.sub_headline ? (
                        <p className="text-xl text-sky-100 font-medium mb-8 max-w-2xl leading-relaxed">
                          {cta.sub_headline}
                        </p>
                      ) : null}
                      {/* Selalu tampilkan tombol di CTA */}
                      <a
                        href={cta.button_link || "/contact"}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-orange text-white rounded-full font-extrabold shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:bg-orange-500 transition-all duration-300 border-2 border-brand-orange hover:border-orange-400 mt-4"
                        target={cta.button_link?.startsWith('http') ? "_blank" : "_self"}
                        rel="noreferrer"
                      >
                        {cta.button_text || "Hubungi Kami Sekarang"}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-24 bg-brand-light">
      {/* Hero Section */}
      <section className="py-20 bg-white border-b border-border-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-heading mb-8 tracking-tight"
            >
              Membentuk Masa Depan <span className="text-brand-orange">Penuh Warna</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted leading-relaxed mb-12 max-w-3xl mx-auto"
            >
              Lebih dari sekadar sekolah, PAUD Husnul Khoir adalah ekosistem tempat anak-anak belajar melalui kegembiraan, tantangan, dan persahabatan. Kami percaya setiap anak memiliki 'pencipta' di dalam dirinya.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-[50px] overflow-hidden shadow-2xl aspect-[16/7] group"
            >
              <img 
                src="/Pkm1.jpeg" 
                alt="PAUD Husnul Khoir Journey" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 w-full max-w-6xl">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-[32px] soft-shadow border border-border-light text-center group hover:bg-brand-blue transition-colors duration-300 cursor-default"
              >
                <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue mx-auto mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl font-black text-heading group-hover:text-white transition-colors">{stat.value}</div>
                <div className="text-xs text-muted uppercase tracking-wider font-bold mt-2 group-hover:text-white/80 transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

      {/* Feature Section (User Requested Grid) */}
      <section className="py-24 bg-white/50 backdrop-blur-sm border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-heading mb-4">Dedikasi Kami</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Filosofi pendidikan kami yang mengakar pada kebahagiaan dan kebebasan bereksplorasi.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 md:p-10 rounded-[32px] border border-border-light shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center group hover:-translate-y-2"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 ${feature.color} rounded-full flex items-center justify-center text-white mb-6 shadow-lg group-hover:rotate-12 transition-transform`}>
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg md:text-2xl font-black text-heading mb-3 leading-tight px-2">{feature.title}</h3>
                <p className="text-muted text-xs md:text-sm leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Highlight */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-sm mb-6 uppercase tracking-widest border border-brand-orange/20">
                <Award className="w-4 h-4" />
                <span>Kurikulum Unggulan</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-heading mb-6 leading-[1.1] tracking-tight">
                Belajar Lewat Sentra: <br className="hidden md:block"/>
                <span className="text-brand-orange relative inline-block mt-2">
                  Moving Class System
                  <div className="absolute -bottom-2 left-0 w-1/2 h-2 bg-brand-orange/30 rounded-full"></div>
                </span>
              </h2>
              <div className="relative mb-10 pl-6 border-l-4 border-brand-orange/40">
                <p className="text-lg md:text-xl text-muted font-medium leading-relaxed">
                  Kami menerapkan sistem <span className="font-bold text-brand-orange">Moving Class</span> di mana setiap ruangan adalah 'Laboratorium Eksplorasi'. Anak-anak bergerak dari satu sentra ke sentra lain, menghadapi tantangan baru setiap hari yang dirancang untuk melatih 7 aspek perkembangan anak.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {curriculums.map((curr, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-white rounded-[24px] border border-border-light shadow-sm">
                    <div className={`w-12 h-12 ${curr.color} rounded-full flex-shrink-0 flex items-center justify-center text-white`}>
                      <curr.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-heading">{curr.title}</h4>
                      <p className="text-xs text-muted leading-relaxed mt-1">{curr.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-4 bg-brand-orange/20 rounded-[60px] blur-2xl group-hover:bg-brand-orange/30 transition-colors"></div>
              <img 
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="PAUD Husnul Khoir Learning environment" 
                className="relative rounded-[50px] shadow-2xl border-8 border-white"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-heading mb-6 tracking-tight">Dipandu Oleh <span className="text-brand-blue italic underline decoration-wavy">Hati</span></h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Tim pendidik kami bukan hanya pengajar, tapi sahabat dan mentor yang memahami psikologi anak.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {teachers.map((teacher, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[32px] p-4 shadow-xl border border-border-light group overflow-hidden"
              >
                <div className="rounded-[24px] overflow-hidden mb-8 aspect-square relative">
                  <img 
                    src={teacher.image} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="px-6 pb-6 text-center">
                  <h4 className="text-2xl font-black text-heading mb-2 leading-tight">{teacher.name}</h4>
                  <p className="text-brand-blue font-bold px-4 py-1 bg-brand-blue/10 rounded-full inline-block text-sm">{teacher.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-heading mb-20"
          >
            Fasilitas <span className="text-brand-orange">Standar Unggul</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {facilities.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 rounded-[32px] bg-brand-light hover:bg-white soft-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 border border-transparent hover:border-border-light text-left"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-brand-orange mb-8 shadow-md group-hover:bg-brand-orange group-hover:text-white group-hover:-rotate-6 transition-all duration-300">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-heading mb-4 leading-tight">{item.title}</h3>
                <p className="text-muted font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
