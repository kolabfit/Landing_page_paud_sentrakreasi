import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { getPages } from "../lib/cms";

type CtaBannerData = {
  headline?: string;
  sub_headline?: string;
  button_text?: string;
  button_link?: string;
  background_image_url?: string;
  background_color?: string;
};

type PageBlock = {
  id?: string;
  type?: string;
  data?: CtaBannerData;
};

type CmsPageWithContent = {
  id: number;
  title: string;
  slug: string;
  content?: PageBlock[];
};

export default function CmsLandingSections() {
  const [pages, setPages] = useState<CmsPageWithContent[]>([]);

  useEffect(() => {
    let isMounted = true;
    getPages()
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setPages(data as CmsPageWithContent[]);
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

  const ctaBlocks = useMemo(() => {
    return pages.flatMap((page) =>
      (page.content || [])
        .filter((block) => block.type === "cta-banner")
        .map((block) => ({
          pageId: page.id,
          pageSlug: page.slug,
          blockId: block.id || "cta",
          data: block.data || {},
        })),
    );
  }, [pages]);

  if (ctaBlocks.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white border-b border-border-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {ctaBlocks.map((block) => {
          const backgroundImage = block.data.background_image_url;
          const backgroundColor = block.data.background_color || "#fffafa";
          return (
            <motion.div
              key={`${block.pageId}-${block.blockId}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[36px] border border-border-light shadow-[0_20px_50px_-25px_rgba(26,149,196,0.25)]"
              style={{ backgroundColor }}
            >
              {backgroundImage ? (
                <div className="absolute inset-0">
                  <img
                    src={backgroundImage}
                    alt={block.data.headline || "CTA background"}
                    className="h-full w-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/20"></div>
                </div>
              ) : null}
              <div className="relative z-10 p-10 md:p-14">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-3">
                  Dari CMS
                </p>
                <h3 className="text-3xl md:text-4xl font-black text-heading mb-4">
                  {block.data.headline || "Judul belum diisi"}
                </h3>
                {block.data.sub_headline ? (
                  <p className="text-lg text-muted font-medium mb-8 max-w-2xl">
                    {block.data.sub_headline}
                  </p>
                ) : null}
                {block.data.button_text && block.data.button_link ? (
                  <a
                    href={block.data.button_link}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {block.data.button_text}
                    <span aria-hidden="true">→</span>
                  </a>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
