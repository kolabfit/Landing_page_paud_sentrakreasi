import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CmsPage, getPages } from "../lib/cms";

export default function CmsPagesSection() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getPages()
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setPages(data);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Gagal memuat halaman");
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

  if (isLoading) {
    return (
      <section className="py-16 bg-white border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted font-medium">
            Memuat halaman dari CMS...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-brand-orange font-semibold">
            Gagal memuat halaman dari CMS: {error}
          </p>
        </div>
      </section>
    );
  }

  if (pages.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white border-b border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 bg-brand-light text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
            Halaman Dari CMS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-heading mb-4 tracking-tight">
            Informasi Tambahan
          </h2>
          <p className="text-muted text-lg font-medium">
            Daftar halaman terbaru yang tersedia di website.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-brand-light rounded-[28px] p-6 border border-blue-50 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-black text-heading mb-3">
                {page.title}
              </h3>
              <p className="text-sm text-muted font-medium mb-6">
                Slug: {page.slug}
              </p>
              <Link
                to={`/pages/${page.slug}`}
                className="inline-flex items-center gap-2 text-brand-orange font-bold hover:text-brand-blue transition-colors"
              >
                Buka Halaman
                <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
