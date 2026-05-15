import { motion, AnimatePresence } from "motion/react";
import { Calendar, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CmsPost, CmsPostDetail, getPostBySlug, getPosts } from "../lib/cms";
import { BlockRenderer } from "./PageDetail";

type DisplayPost = {
  id: number;
  title: string;
  slug: string;
  dateLabel: string;
  image: string;
  excerpt: string;
  category?: string;
};

type CmsContentBlock = NonNullable<CmsPostDetail["content"]>[number];

const fallbackNewsItems: DisplayPost[] = [
  {
    id: 1,
    slug: "fallback-1",
    title: "Keseruan Pentas Seni Akhir Tahun 2025",
    excerpt:
      "Anak-anak menampilkan berbagai bakat menarik mulai dari menyanyi, menari, hingga bermain angklung dengan penuh semangat.",
    dateLabel: "10 Desember 2025",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "fallback-2",
    title: "Kunjungan Edukatif ke Kebun Raya",
    excerpt:
      "Mengenal berbagai jenis tumbuhan dan belajar mencintai alam sekitar melalui kegiatan luar ruangan yang interaktif.",
    dateLabel: "24 November 2025",
    image:
      "https://images.unsplash.com/photo-1588612140409-5a12403611ad?q=80&w=1964&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "fallback-3",
    title: "Workshop Parenting Sehat",
    excerpt:
      "Kolaborasi antara guru dan orang tua dalam seminar khusus membahas gizi seimbang untuk tumbuh kembang optimal anak.",
    dateLabel: "05 November 2025",
    image:
      "https://images.unsplash.com/photo-1533222481259-ce20eda1e20b?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 4,
    slug: "fallback-4",
    title: "Lomba Mewarnai Tingkat Kecamatan",
    excerpt:
      "Siswa PAUD Husnul Khoir berhasil meraih juara 1 dalam lomba mewarnai yang diadakan dalam rangka memeriahkan hari pahlawan.",
    dateLabel: "15 Oktober 2025",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&h=675&auto=format&fit=crop",
  },
  {
    id: 5,
    slug: "fallback-5",
    title: "Kegiatan Cooking Class Spesial Hari Ayah",
    excerpt:
      "Mengenalkan anak tentang bahan makanan sehat sambil membuat karya cupcake lucu bersama ayah.",
    dateLabel: "20 September 2025",
    image:
      "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=1200&h=675&auto=format&fit=crop",
  },
  {
    id: 6,
    slug: "fallback-6",
    title: "Bulan Imunisasi Anak Nasional",
    excerpt:
      "Bekerja sama dengan Puskesmas setempat, kami melaksanakan program imunisasi demi menjaga kekebalan komunal.",
    dateLabel: "05 Agustus 2025",
    image:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200&h=675&auto=format&fit=crop",
  },
];

export default function NewsArchive() {
  const [selectedArticle, setSelectedArticle] = useState<DisplayPost | null>(
    null,
  );
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [detail, setDetail] = useState<CmsPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const formatDate = (value?: string) => {
      if (!value) {
        return "Update";
      }
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) {
        return "Update";
      }
      return parsed.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const toDisplayPost = (post: CmsPost): DisplayPost => {
      const blockImage = post.content?.[0]?.featured_image;
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        dateLabel: formatDate(post.created_at),
        image: post.featured_image || blockImage || fallbackNewsItems[0].image,
        excerpt: post.excerpt || "Ringkasan belum tersedia.",
        category: post.category,
      };
    };

    setIsLoading(true);
    getPosts()
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setPosts(data.map(toDisplayPost));
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Gagal memuat berita");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedArticle) {
      return;
    }

    if (selectedArticle.slug.startsWith("fallback-")) {
      setDetail(null);
      return;
    }

    let isMounted = true;
    setIsDetailLoading(true);
    getPostBySlug(selectedArticle.slug)
      .then((data) => {
        if (isMounted) {
          setDetail(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDetail(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsDetailLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedArticle]);

  const handleReadMore = (post: DisplayPost) => {
    setSelectedArticle(post);
    document.body.style.overflow = "hidden";
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    setDetail(null);
    document.body.style.overflow = "auto";
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
        <h3 className="text-2xl font-black text-brand-blue mb-3 z-10 tracking-tight">Memuat Arsip Berita...</h3>
        <p className="text-muted font-medium text-center max-w-xs z-10 leading-relaxed">
          Tunggu sebentar, kami sedang menyusun riwayat kegiatan sekolah.
        </p>
      </div>
    );
  }

  const activeArticle = selectedArticle;
  const items = posts.length > 0 ? posts : fallbackNewsItems;

  return (
    <section className="pt-32 pb-24 bg-brand-light min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-orange/10 to-transparent rounded-br-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tl from-brand-blue/10 to-transparent rounded-tl-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 pb-8 relative">
          <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-blue rounded-full"></div>
          <div className="max-w-3xl">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-white bg-brand-blue px-4 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors mb-6 uppercase tracking-widest text-xs shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-heading mb-6 tracking-tight leading-[1.1]"
            >
              Arsip{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-500">
                Berita Penuh
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-muted leading-relaxed font-medium pl-5 border-l-4 border-brand-orange/30 mt-4"
            >
              Kumpulan seluruh perjalanan, cerita, dan pengalaman seru yang
              terukir di tahun pembelajaran ini.
            </motion.p>
          </div>
        </div>

        {error ? (
          <p className="text-sm text-brand-orange font-semibold mb-8">
            Gagal memuat CMS, menampilkan konten cadangan.
          </p>
        ) : null}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((news, idx) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[32px] overflow-hidden border border-border-light shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(26,149,196,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col p-4 gap-6 group"
            >
              <div
                className="aspect-[4/3] rounded-[24px] overflow-hidden relative cursor-pointer"
                onClick={() => handleReadMore(news)}
              >
                <div className="absolute inset-0 bg-brand-blue/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col flex-1 px-4 mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted mb-4 uppercase tracking-widest pl-3 border-l-2 border-brand-blue">
                  <Calendar className="w-3 h-3 text-brand-blue" />
                  <span>{news.dateLabel}</span>
                </div>
                <h3
                  className="text-xl font-bold text-heading mb-3 leading-[1.4] group-hover:text-brand-orange transition-colors cursor-pointer"
                  onClick={() => handleReadMore(news)}
                >
                  {news.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                  {news.excerpt}
                </p>
                <button
                  onClick={() => handleReadMore(news)}
                  className="w-full py-3.5 bg-brand-light border border-orange-50 rounded-[16px] text-sm font-bold text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 mt-auto flex items-center justify-center gap-2"
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 hidden group-hover:block transition-all" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && activeArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeArticle}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <button
                onClick={closeArticle}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-heading hover:bg-white hover:text-brand-blue transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto w-full no-scrollbar">
                <div className="w-full h-64 md:h-80 relative shrink-0">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-3 uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      <span>{activeArticle.date}</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
                      {activeArticle.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 md:p-10">
                  <div className="prose prose-lg max-w-none text-muted font-medium">
                    <p className="lead text-xl text-heading font-medium mb-6">
                      {activeArticle.excerpt}
                    </p>
                    {isDetailLoading ? (
                      <p className="text-sm text-muted">
                        Memuat konten dari CMS...
                      </p>
                    ) : detail?.content && detail.content.length > 0 ? (
                      <div className="space-y-6">
                        {detail.content.map((block: any, index) => {
                          const htmlContent = block.body_content || block.html;
                          if (htmlContent && typeof htmlContent === 'string') {
                            return (
                              <div
                                key={`html-${index}`}
                                className="text-body leading-relaxed relative z-10 max-w-none text-lg md:text-xl break-words
                                           [&_h1]:hidden
                                           [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-black [&_h2]:text-heading [&_h2]:tracking-tight [&_h2]:mb-4 [&_h2]:mt-8
                                           [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-black [&_h3]:text-heading [&_h3]:mb-4 [&_h3]:mt-6
                                           [&_p]:mb-6 [&_p]:break-words
                                           [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul>li]:mb-2 [&_ul>li]:marker:text-brand-orange
                                           [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol>li]:mb-2 [&_ol>li]:marker:text-brand-orange
                                           [&_a]:text-brand-blue [&_a]:font-bold hover:[&_a]:text-brand-orange [&_a]:transition-colors
                                           [&_img]:rounded-3xl [&_img]:shadow-xl [&_img]:border [&_img]:border-border-light [&_img]:w-full [&_img]:my-8"
                                dangerouslySetInnerHTML={{ __html: htmlContent.replace(/&nbsp;/g, ' ') }}
                              />
                            );
                          }
                          return <BlockRenderer key={block.id || `block-${index}`} block={block} />;
                        })}
                      </div>
                    ) : (
                      <p className="mb-4">
                        Konten lengkap sedang disiapkan. Silakan kembali lagi
                        untuk membaca informasi selengkapnya.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
