import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CmsPageDetail, getPages } from "../lib/cms";
import { BookOpen, Heart, Users, Star, Shield, Smile, Lightbulb, Target, Award, CheckCircle, Calendar, ArrowRight } from "lucide-react";

export type CmsContentBlock = NonNullable<CmsPageDetail["content"]>[number];

/* ── Render a single CMS content block ── */
function extractImageUrl(field: any): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field.url || field.src || field.image_url || "";
  }
  return "";
}

export function BlockRenderer({ block, key: _key }: { block: CmsContentBlock; key?: string }) {
  const data = block?.data as Record<string, unknown> | undefined;
  if (!data) return null;

  // ── Rich-text / HTML block ──
  if (block.type === "rich-text" || block.type === "html") {
    const html = (data.html ?? data.content ?? data.body ?? "") as string;
    if (!html) return null;
    return (
      <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-[0_20px_50px_-25px_rgba(26,149,196,0.15)] border border-white hover:shadow-[0_20px_50px_-25px_rgba(26,149,196,0.3)] transition-all duration-500 relative overflow-hidden group my-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-blue/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-brand-orange/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div
          className="text-body leading-relaxed relative z-10 max-w-none text-lg md:text-xl
                     [&>h1]:text-4xl [&>h1]:md:text-5xl [&>h1]:font-black [&>h1]:text-heading [&>h1]:tracking-tight [&>h1]:mb-6 [&>h1]:mt-10
                     [&>h2]:text-3xl [&>h2]:md:text-4xl [&>h2]:font-black [&>h2]:text-heading [&>h2]:tracking-tight [&>h2]:mb-4 [&>h2]:mt-8
                     [&>h3]:text-2xl [&>h3]:md:text-3xl [&>h3]:font-black [&>h3]:text-heading [&>h3]:mb-4 [&>h3]:mt-6
                     [&>p]:mb-6
                     [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:marker:text-brand-orange
                     [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:marker:text-brand-orange
                     [&_a]:text-brand-blue [&_a]:font-bold hover:[&_a]:text-brand-orange [&_a]:transition-colors
                     [&_img]:rounded-3xl [&_img]:shadow-xl [&_img]:border [&_img]:border-border-light [&_img]:w-full [&_img]:my-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  // ── Plain text / paragraph block ──
  if (block.type === "text" || block.type === "paragraph") {
    const text = (data.text ?? data.content ?? data.body ?? "") as string;
    if (!text) return null;
    return (
      <div className="relative pl-8 border-l-4 border-brand-orange/50 py-2 my-8 group">
        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-brand-orange rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
        <p className="text-body text-xl leading-relaxed font-medium text-muted group-hover:text-heading transition-colors duration-500">
          {text}
        </p>
      </div>
    );
  }

  // ── Heading block ──
  if (block.type === "heading") {
    const text = (data.text ?? data.content ?? "") as string;
    const level = Math.min(Math.max(Number(data.level ?? 2), 1), 6);
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return (
      <div className="relative inline-block my-6 group">
        <Tag className="text-heading font-black tracking-tight text-3xl md:text-5xl relative z-10">
          {text}
        </Tag>
        <div className="absolute -bottom-2 left-0 w-1/3 h-2 bg-brand-orange rounded-full group-hover:w-full transition-all duration-500"></div>
      </div>
    );
  }

  // ── Image block ──
  if (block.type === "image" || block.type === "media") {
    const src = extractImageUrl(data.image) || extractImageUrl(data) || (data.url ?? data.src ?? data.image_url ?? "") as string;
    const alt = (data.alt ?? data.caption ?? "") as string;
    const caption = (data.caption ?? "") as string;
    if (!src) return null;
    return (
      <figure className="my-12 relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-orange/20 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
        <div className="relative overflow-hidden rounded-[48px] shadow-2xl border-[8px] border-white bg-white group-hover:-rotate-1 transition-transform duration-700">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
          <img
            src={src}
            alt={alt}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
        </div>
        {caption ? (
          <figcaption className="text-center text-sm text-muted mt-4 font-bold tracking-wide uppercase">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  // ── Hero block ──
  if (block.type === "hero") {
    const headline = (data.headline ?? "") as string;
    const subHeadline = (data.sub_headline ?? "") as string;
    const backgroundImage = extractImageUrl(data.background_image) || extractImageUrl(data.background_image_url) || "";
    const stats = (data.stats ?? []) as Array<Record<string, any>>;
    
    return (
      <>
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center my-16 relative">
        {/* Floating background elements for Hero */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -z-10 -translate-y-1/2"></div>
        
        <div className="mb-12 lg:mb-0 relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md text-brand-blue rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-sm border border-blue-100 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
            Sorotan Utama
          </div>
          {headline && (
            <h2 className="text-5xl lg:text-7xl font-black text-heading tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
              {headline}
            </h2>
          )}
          {subHeadline && (
            <p className="text-xl text-muted font-medium leading-relaxed max-w-lg border-l-4 border-brand-orange pl-6 mb-10">
              {subHeadline}
            </p>
          )}

        </div>
        
        {backgroundImage ? (
          <div className="relative aspect-[4/3] rounded-[48px] group lg:ml-auto w-full max-w-lg perspective-1000">
            {/* Decorative rotated backdrops */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-orange-300 rounded-[48px] rotate-[-4deg] opacity-60 group-hover:rotate-[-8deg] transition-all duration-700 shadow-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-sky-400 rounded-[48px] rotate-[4deg] opacity-60 group-hover:rotate-[8deg] transition-all duration-700 shadow-xl"></div>
            
            {/* Main Image */}
            <div className="relative h-full w-full rounded-[48px] overflow-hidden shadow-2xl border-[6px] border-white bg-white group-hover:-translate-y-2 transition-transform duration-700">
              <img
                src={backgroundImage}
                alt={headline || "Hero banner"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Nested Stats Below Hero (Centered Full Width) ── */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-8 mb-24 relative z-20 max-w-5xl mx-auto w-full">
          {stats.map((stat, idx) => {
            const val = (stat.value ?? stat.stat ?? stat.number ?? "") as string;
            const lbl = (stat.label ?? stat.title ?? stat.description ?? "") as string;
            if (!val && !lbl) return null;

            const isBlue = idx % 2 === 0;
            
            let Icon = Star;
            if (idx === 0) Icon = Calendar;
            if (idx === 1) Icon = Users;
            if (idx === 2) Icon = Award;
            if (idx === 3) Icon = Shield;

            return (
              <div key={idx} className="bg-white p-6 rounded-[32px] shadow-[0_10px_30px_-10px_rgba(26,149,196,0.15)] border border-blue-50 hover:shadow-[0_15px_40px_-10px_rgba(26,149,196,0.25)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${isBlue ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-orange/10 text-brand-orange'}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className={`text-4xl md:text-5xl font-black mb-2 ${isBlue ? 'text-brand-blue' : 'text-brand-orange'}`}>
                  {val}
                </div>
                <div className="text-sm font-bold text-muted leading-relaxed">
                  {lbl}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </>
    );
  }

  // ── Profile Tabs block ──
  if (block.type === "profile-tabs") {
    const title = (data.title ?? "") as string;
    const tabs = (data.tabs ?? []) as Array<{label?: string, content?: string}>;
    
    return (
      <div className="my-8">
        {title && <h3 className="text-2xl font-black text-heading mb-5 inline-block relative">
          {title}
          <div className="absolute -bottom-1 left-0 w-1/2 h-1 bg-brand-orange rounded-full"></div>
        </h3>}
        {tabs && tabs.length > 0 && (
          <div className="space-y-4">
            {tabs.map((tab, idx) => (
              <div key={idx} className="bg-brand-light p-6 rounded-[24px] border border-blue-50 hover:shadow-md transition-shadow">
                {tab.label && <h4 className="font-bold text-lg text-brand-blue mb-3">{tab.label}</h4>}
                {tab.content && (
                  <div
                    className="prose prose-lg max-w-none text-body leading-relaxed
                               prose-headings:text-heading prose-headings:font-black
                               prose-a:text-brand-blue hover:prose-a:text-brand-orange"
                    dangerouslySetInnerHTML={{ __html: tab.content }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Gallery block ──
  if (block.type === "gallery" || block.type === "image-gallery") {
    const imagesArray = (Array.isArray(data) ? data : (data.images || data.items || data.gallery || [])) as any[];
    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
      const title = (!Array.isArray(data) ? (data.title ?? data.heading ?? "") : "") as string;
      const subtitle = (!Array.isArray(data) ? (data.subtitle ?? data.description ?? "") : "") as string;
      return (
        <div className="my-16">
          {(title || subtitle) && (
            <div className="text-center mb-10 max-w-3xl mx-auto">
              {title && <h2 className="text-3xl md:text-5xl font-black text-heading mb-4 tracking-tight">{title}</h2>}
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
      );
    }
  }

  // ── CTA Banner block (handled separately below) ──
  if (block.type === "cta-banner") return null;

  // ── Smart Feature / Cards / List Block Detector ──
  // If the CMS sends a block type we don't explicitly know (like 'features', 'list', 'services')
  // but it contains an array of items (like title & description), we render it as a beautiful grid.
  const isDataArray = Array.isArray(data);
  const arrayField = !isDataArray ? Object.entries(data).find(([_, val]) => Array.isArray(val) && val.length > 0) : null;
  
  if ((block.type?.includes("feature") || block.type?.includes("stat") || block.type?.includes("card") || block.type?.includes("list") || arrayField || isDataArray) && block.type !== "profile-tabs") {
    
    // Find the array of items
    const items = (isDataArray ? data : (arrayField ? arrayField[1] : [])) as Array<Record<string, any>>;
    const sectionTitle = (!isDataArray ? (data.title ?? data.heading ?? data.name ?? "") : "") as string;
    const sectionDesc = (!isDataArray ? (data.description ?? data.subtitle ?? data.summary ?? "") : "") as string;

    if (items.length > 0) {
      return (
        <div className="my-20">
          {/* Section Header */}
          {(sectionTitle || sectionDesc) && (
            <div className="text-center max-w-3xl mx-auto mb-16">
              {sectionTitle && (
                <h2 className="text-4xl md:text-5xl font-black text-heading mb-6 tracking-tight">
                  {sectionTitle}
                </h2>
              )}
              {sectionDesc && (
                <p className="text-lg md:text-xl text-muted font-medium">
                  {sectionDesc}
                </p>
              )}
            </div>
          )}

          {/* Cards Grid */}
          <div className={`grid md:grid-cols-2 ${items.length === 1 ? 'lg:grid-cols-1 max-w-xl mx-auto' : (items.length === 2 || items.length === 4) ? 'lg:grid-cols-2 max-w-5xl mx-auto' : 'lg:grid-cols-3'} gap-8`}>
            {items.map((item, idx) => {
              let itemTitle = (item.title ?? item.name ?? item.heading ?? item.value ?? item.stat ?? item.number ?? "") as string;
              let itemDesc = (item.description ?? item.role ?? item.text ?? item.content ?? item.summary ?? item.label ?? "") as string;
              const itemIcon = extractImageUrl(item.icon) || extractImageUrl(item.image) || extractImageUrl(item.icon_url) || extractImageUrl(item.photo_url) || extractImageUrl(item.photo) || extractImageUrl(item.avatar) || extractImageUrl(item.thumbnail) || "";

              // Fallback: If no recognized keys are found, just grab the first two string values
              if (!itemTitle && !itemDesc) {
                const stringValues = Object.values(item).filter(v => typeof v === 'string') as string[];
                if (stringValues.length > 0) itemTitle = stringValues[0];
                if (stringValues.length > 1) itemDesc = stringValues[1];
              }

              if (!itemTitle && !itemDesc) return null;
              
              // Check if it looks like a "Stat" (e.g. "15+", "100%")
              const isStat = itemTitle.length <= 10 && /\d/.test(itemTitle);

              // ── Auto Icon Logic ──
              let AutoIcon = null;
              if (!itemIcon) {
                const textForIcon = (itemTitle + " " + itemDesc).toLowerCase();
                if (textForIcon.includes("kurikulum") || textForIcon.includes("belajar") || textForIcon.includes("baca")) {
                  AutoIcon = <BookOpen className="w-8 h-8 text-brand-blue group-hover:scale-110 transition-transform" />;
                } else if (textForIcon.includes("karakter") || textForIcon.includes("hati") || textForIcon.includes("kasih") || textForIcon.includes("cinta")) {
                  AutoIcon = <Heart className="w-8 h-8 text-brand-orange group-hover:scale-110 transition-transform" />;
                } else if (textForIcon.includes("sosial") || textForIcon.includes("interaktif") || textForIcon.includes("teman") || textForIcon.includes("kolaborasi")) {
                  AutoIcon = <Users className="w-8 h-8 text-brand-blue group-hover:scale-110 transition-transform" />;
                } else if (textForIcon.includes("aman") || textForIcon.includes("nyaman") || textForIcon.includes("lindungi") || textForIcon.includes("pengawasan")) {
                  AutoIcon = <Shield className="w-8 h-8 text-brand-blue group-hover:scale-110 transition-transform" />;
                } else if (textForIcon.includes("psikologi") || textForIcon.includes("senyum") || textForIcon.includes("bahagia") || textForIcon.includes("bermain")) {
                  AutoIcon = <Smile className="w-8 h-8 text-brand-orange group-hover:scale-110 transition-transform" />;
                } else if (textForIcon.includes("prestasi") || textForIcon.includes("unggul") || textForIcon.includes("juara")) {
                  AutoIcon = <Award className="w-8 h-8 text-brand-orange group-hover:scale-110 transition-transform" />;
                } else if (textForIcon.includes("potensi") || textForIcon.includes("bakat") || textForIcon.includes("ide") || textForIcon.includes("kreatif")) {
                  AutoIcon = <Lightbulb className="w-8 h-8 text-brand-blue group-hover:scale-110 transition-transform" />;
                } else if (textForIcon.includes("fokus") || textForIcon.includes("target") || textForIcon.includes("tujuan") || textForIcon.includes("terarah")) {
                  AutoIcon = <Target className="w-8 h-8 text-brand-orange group-hover:scale-110 transition-transform" />;
                } else {
                  // Fallback icons cycling through nice defaults based on index
                  const defaultIcons = [
                    <Star className="w-8 h-8 text-brand-orange group-hover:scale-110 transition-transform" />,
                    <CheckCircle className="w-8 h-8 text-brand-blue group-hover:scale-110 transition-transform" />,
                    <Lightbulb className="w-8 h-8 text-brand-orange group-hover:scale-110 transition-transform" />,
                    <Smile className="w-8 h-8 text-brand-blue group-hover:scale-110 transition-transform" />
                  ];
                  AutoIcon = defaultIcons[idx % defaultIcons.length];
                }
              }

              return (
                <div
                  key={idx}
                  className="group relative flex flex-col h-full bg-white rounded-[32px] border border-blue-100/50 shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(26,149,196,0.15)] hover:border-brand-blue/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer"
                >
                  {/* Media Section (Always h-48 for balance) */}
                  <div className="h-48 w-full relative overflow-hidden">
                    {itemIcon && itemIcon.startsWith("http") ? (
                      /* Full Image Header */
                      <div className="h-full w-full">
                        <div className="absolute inset-0 bg-brand-blue/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 z-10"></div>
                        <img 
                          src={itemIcon} 
                          alt={itemTitle} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      /* Stylized Icon Background */
                      <div className={`h-full w-full flex items-center justify-center transition-colors duration-500 ${idx % 2 === 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative w-20 h-20 bg-white rounded-3xl shadow-sm border border-blue-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          {itemIcon ? (
                            <span className="text-3xl">{itemIcon}</span>
                          ) : (
                            AutoIcon
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex-grow flex flex-col">
                    {itemTitle && (
                      <h3 className={`${isStat ? 'text-5xl lg:text-6xl text-brand-orange drop-shadow-sm' : 'text-2xl text-heading'} font-black mb-4 leading-tight`}>
                        {itemTitle}
                      </h3>
                    )}
                    {itemDesc && (
                      <p className={`text-muted leading-relaxed ${isStat ? 'font-bold text-xl uppercase tracking-wide' : 'font-medium'} mb-6`}>
                        {itemDesc}
                      </p>
                    )}
                    
                    {/* Interactive Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className={`absolute top-0 right-0 w-2 h-24 ${idx % 2 === 0 ? 'bg-brand-blue/20' : 'bg-brand-orange/20'} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }

  // ── Generic fallback: render any string values from data recursively ──
  const extractStrings = (obj: any): string[] => {
    let result: string[] = [];
    if (typeof obj === "string") {
      if (obj.trim().length > 0) result.push(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach((item) => {
        result = result.concat(extractStrings(item));
      });
    } else if (typeof obj === "object" && obj !== null) {
      Object.values(obj).forEach((val) => {
        result = result.concat(extractStrings(val));
      });
    }
    return result;
  };

  const allStrings = extractStrings(data);
  if (allStrings.length === 0) return null;

  return (
    <div className="space-y-4 my-10 p-8 bg-white/50 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-blue-200 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="mb-4 inline-block px-3 py-1 bg-blue-50 text-brand-blue text-xs font-bold uppercase tracking-widest rounded-full">
        Blok Teks / Data Tambahan
      </div>
      {allStrings.map((value, i) => {
        // If it's an image link
        if (value.startsWith("http") && (value.includes("image") || value.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || value.includes("thumbnail?id="))) {
          return <img key={i} src={value} alt="CMS Content" className="w-full max-w-4xl rounded-[40px] shadow-xl border-8 border-brand-light mx-auto" referrerPolicy="no-referrer" />;
        }
        // If it's a regular link
        if (value.startsWith("http")) {
          return <a key={i} href={value} target="_blank" rel="noreferrer" className="text-brand-blue hover:text-brand-orange hover:underline break-all block my-2 font-bold">{value}</a>;
        }
        // If it has HTML
        if (/<[a-z][\s\S]*>/i.test(value)) {
          return (
            <div
              key={i}
              className="prose prose-lg max-w-none text-body leading-relaxed
                         prose-headings:text-heading prose-headings:font-black
                         prose-a:text-brand-blue hover:prose-a:text-brand-orange
                         prose-img:rounded-2xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          );
        }
        // Otherwise text (alternate styling to make it look like a list if it's alternating)
        const isLikelyTitle = value.length < 60 && !value.includes(".") && i % 2 === 0;
        
        return (
          <div key={i} className={`text-body leading-relaxed ${isLikelyTitle ? 'text-2xl font-black text-heading mt-6 mb-2' : 'text-lg font-medium text-muted'}`}>
            {value}
          </div>
        );
      })}
    </div>
  );
}

export default function PageDetail() {
  const { slug } = useParams();
  const [page, setPage] = useState<CmsPageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    // Fetch all pages (list endpoint returns content blocks) and find by slug
    getPages()
      .then((items) => {
        if (!isMounted) return;
        const match = (items as CmsPageDetail[]).find(
          (item) => item.slug.replace(/^\/+/, "").toLowerCase() === slug.toLowerCase(),
        );
        if (!match) {
          setError("Halaman tidak ditemukan");
          return;
        }
        setPage(match);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Gagal memuat halaman");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Separate CTA blocks from content blocks
  const ctaBlocks = useMemo(() => {
    if (!page?.content) return [];
    return page.content
      .filter((block) => block.type === "cta-banner")
      .map((block) => block.data || {});
  }, [page]);

  const contentBlocks = useMemo(() => {
    if (!page?.content) return [];
    return page.content.filter((block) => block.type !== "cta-banner");
  }, [page]);

  const hasContent = ctaBlocks.length > 0 || contentBlocks.length > 0;

  return (
    <section className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background abstract shapes for loading screen */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-brand-orange/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative w-32 h-32 mb-8 z-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-orange/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-4 bg-brand-blue/10 rounded-full animate-pulse"></div>
              {/* Logo container */}
              <div className="relative bg-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center border-4 border-blue-50 z-20">
                <div className="w-8 h-8 border-4 border-brand-orange border-t-brand-blue rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-2xl font-black text-brand-blue mb-3 z-10 tracking-tight">Memuat Halaman...</h3>
            <p className="text-muted font-medium text-center max-w-xs z-10 leading-relaxed">
              Tunggu sebentar, kami sedang mengambil konten terbaru.
            </p>
          </div>
        ) : error ? (
          <p className="text-sm text-brand-orange font-semibold mt-6">
            Gagal memuat halaman dari CMS: {error}
          </p>
        ) : page ? (
          <div className="mt-8">


            {/* ── CTA Banner Blocks ── */}
            {ctaBlocks.length > 0 ? (
              <div className="space-y-8 mb-10">
                {ctaBlocks.map((cta, index) => {
                  const backgroundImage = cta.background_image_url;
                  const backgroundColor = cta.background_color || "#fffafa";
                  return (
                    <div
                      key={`${page.id}-cta-${index}`}
                      className="relative overflow-hidden rounded-[36px] border border-border-light shadow-[0_20px_50px_-25px_rgba(26,149,196,0.25)]"
                      style={{ backgroundColor }}
                    >
                      {backgroundImage ? (
                        <div className="absolute inset-0">
                          <img
                            src={backgroundImage}
                            alt={cta.headline || "CTA background"}
                            className="h-full w-full object-cover opacity-80"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/20"></div>
                        </div>
                      ) : null}
                      <div className="relative z-10 p-10 md:p-12">
                        <h2 className="text-3xl md:text-4xl font-black text-heading mb-3">
                          {cta.headline || "Judul belum diisi"}
                        </h2>
                        {cta.sub_headline ? (
                          <p className="text-lg text-muted font-medium mb-6 max-w-2xl">
                            {cta.sub_headline}
                          </p>
                        ) : null}
                        {cta.button_text && cta.button_link ? (
                          <a
                            href={cta.button_link}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {cta.button_text}
                            <span aria-hidden="true">→</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* ── Content Blocks (text, rich-text, image, heading, etc.) ── */}
            {contentBlocks.length > 0 ? (
              <div className="space-y-6">
                {contentBlocks.map((block, index) => (
                  <BlockRenderer key={block.id || `block-${index}`} block={block} />
                ))}
              </div>
            ) : null}

            {/* ── Empty state ── */}
            {!hasContent ? (
              <p className="text-muted text-lg font-medium">
                Konten halaman ini belum tersedia.
              </p>
            ) : null}

            {/* ── DEBUG OUTPUT (To see raw data) ── */}
            <div className="mt-32 p-6 bg-slate-900 text-green-400 font-mono text-sm overflow-auto rounded-2xl shadow-2xl">
              <p className="text-white mb-4 font-bold uppercase tracking-widest border-b border-slate-700 pb-2">🛠 Debug Info (Tolong Foto Bagian Ini)</p>
              <pre className="whitespace-pre-wrap word-break">{JSON.stringify(page.content, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <p className="text-muted text-lg font-medium mt-6">
            Halaman tidak ditemukan.
          </p>
        )}
      </div>
    </section>
  );
}
