import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useCmsSettings } from "../lib/useCmsSettings";
import { useEffect, useState } from "react";
import { getPages, CmsPageDetail } from "../lib/cms";

function extractSocialLinks(richTextHtml: string): Record<string, string> {
  const links: Record<string, string> = {};
  const text = richTextHtml.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '\n');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const lower = line.toLowerCase();
    const urlMatch = line.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) continue;
    const url = urlMatch[0];
    if (lower.startsWith('instagram')) links.instagram = url;
    else if (lower.startsWith('facebook')) links.facebook = url;
    else if (lower.startsWith('twitter')) links.twitter = url;
    else if (lower.startsWith('youtube')) links.youtube = url;
  }
  return links;
}

function convertLocalToRelative(url: string): string {
  if (!url) return '/';
  try {
    const parsed = new URL(url);
    return parsed.pathname || '/';
  } catch {
    return url;
  }
}

export default function Footer() {
  const { settings } = useCmsSettings();
  const [footerData, setFooterData] = useState<CmsPageDetail | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPages()
      .then((items) => {
        if (!isMounted) return;
        const match = (items as CmsPageDetail[]).find(
          (item) => item.slug.toLowerCase() === 'footer' || item.title.toLowerCase() === 'footer'
        );
        if (match) setFooterData(match);
      })
      .catch(console.error);
    return () => { isMounted = false; };
  }, []);

  const getBrandParts = (name?: string) => {
    const fallback = "PAUD HUSNUL KHOIR";
    const safeName = name && name.trim() ? name.trim() : fallback;
    const parts = safeName.split(/\s+/);
    if (parts.length <= 1) return { primary: safeName, secondary: "" };
    return { primary: parts[0], secondary: parts.slice(1).join(" ") };
  };

  const { primary, secondary } = getBrandParts(settings?.site_name);
  const logoSrc = settings?.site_logo || "/Logo_1_-removebg-preview.png";

  // Parse CMS blocks
  const content = footerData?.content || [];

  const richTextBlocks = content.filter(b => b.type === 'rich-text').map(b => (b.data as any)?.content || '');
  
  // Description from first rich-text block (first paragraph only)
  const descriptionHtml = richTextBlocks[0] || '';
  const descriptionText = descriptionHtml
    .replace(/&nbsp;/g, ' ')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map((l: string) => l.trim())
    .filter(Boolean)[0] || '';

  // Copyright: look for a rich-text block containing © symbol
  const copyrightBlock = richTextBlocks.find((html: string) => html.includes('©') || html.toLowerCase().includes('hak cipta'));
  const copyrightText = copyrightBlock
    ? copyrightBlock
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]+>/g, '\n')
        .split('\n')
        .map((l: string) => l.trim())
        .filter((l: string) => l.includes('©') || l.toLowerCase().includes('hak cipta'))[0] || ''
    : '';

  // Social links from second rich-text block
  const socialHtml = richTextBlocks[1] || '';
  const socialLinks = extractSocialLinks(socialHtml);

  // Features blocks → navigation columns
  const featureBlocks = content.filter(b => b.type === 'features');
  const quickLinks = ((featureBlocks[0]?.data as any)?.items || []) as Array<{ title: string; link_url?: string }>;
  const serviceLinks = ((featureBlocks[1]?.data as any)?.items || []) as Array<{ title: string; link_url?: string }>;
  const quickLinksTitle = (featureBlocks[0]?.data as any)?.title || 'Tautan Cepat';
  const serviceLinksTitle = (featureBlocks[1]?.data as any)?.title || 'Layanan Pendidikan';

  // Contacts block
  const contactsBlock = (content.find(b => b.type === 'contacts')?.data as any) || {};
  const address = contactsBlock?.addresses?.[0] || '';
  const phone = contactsBlock?.phone_numbers?.[0] || '';
  const email = contactsBlock?.emails?.[0] || '';
  const workingHours = contactsBlock?.working_hours || '';
  const contactsTitle = contactsBlock?.title || 'Lokasi & Hubungi';

  // Only use fallback nav if CMS not connected yet (footerData is null = still loading or failed)
  const fallbackQuickLinks = [
    { title: 'Beranda', link_url: '/' },
    { title: 'Profil PAUD', link_url: '/profile' },
    { title: 'Galeri Kegiatan', link_url: '/gallery/kegiatan' },
    { title: 'Berita & Informasi', link_url: '/news' },
    { title: 'Hubungi Kami', link_url: '/contact' },
  ];
  const fallbackServiceLinks = [
    { title: 'Pendaftaran Siswa Baru', link_url: '/contact' },
    { title: 'Kurikulum Sentra', link_url: '/profile' },
    { title: 'Program Khusus (Ekskul)', link_url: '/profile' },
    { title: 'Konsultasi Orang Tua', link_url: '/contact' },
    { title: 'Karir Pengajar', link_url: '/contact' },
  ];

  // Use CMS data if footerData loaded, else fallback
  const navLinks = footerData ? quickLinks : fallbackQuickLinks;
  const svcLinks = footerData ? serviceLinks : fallbackServiceLinks;

  const socialIcons = [
    { key: 'instagram', icon: <Instagram className="w-5 h-5" />, href: socialLinks.instagram },
    { key: 'facebook', icon: <Facebook className="w-5 h-5" />, href: socialLinks.facebook },
    { key: 'twitter', icon: <Twitter className="w-5 h-5" />, href: socialLinks.twitter },
    { key: 'youtube', icon: <Youtube className="w-5 h-5" />, href: socialLinks.youtube },
  ];

  return (
    <footer className="bg-white border-t border-border-light py-12 lg:py-16 text-footer-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center group mb-6">
              <img
                src={logoSrc}
                alt={`${primary} ${secondary}`.trim() || "Logo"}
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-sm origin-left transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col justify-center ml-2 sm:ml-3">
                <span className="font-extrabold text-2xl tracking-tight text-brand-blue leading-none transition-colors duration-300">
                  {primary}
                </span>
                {secondary ? (
                  <span className="font-bold text-lg tracking-wide text-brand-orange leading-tight transition-colors duration-300 mt-0.5">
                    {secondary}
                  </span>
                ) : null}
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              {descriptionText}
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ key, icon, href }) =>
                href ? (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#F7FAFC] flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors"
                  >
                    {icon}
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-heading font-bold mb-6">{quickLinksTitle}</h4>
            <ul className="space-y-3">
              {navLinks.map((item, i) => {
                const href = item.link_url ? convertLocalToRelative(item.link_url) : '/';
                const isExternal = item.link_url?.startsWith('http') && !item.link_url?.includes('localhost');
                return (
                  <li key={i}>
                    {isExternal ? (
                      <a href={item.link_url} target="_blank" rel="noreferrer" className="hover:text-heading transition-colors">
                        {item.title}
                      </a>
                    ) : (
                      <Link to={href} className="hover:text-heading transition-colors" onClick={() => window.scrollTo(0, 0)}>
                        {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Service Links */}
          <div>
            <h4 className="text-heading font-bold mb-6">{serviceLinksTitle}</h4>
            <ul className="space-y-3">
              {svcLinks.map((item, i) => {
                const href = item.link_url ? convertLocalToRelative(item.link_url) : '/';
                const isExternal = item.link_url?.startsWith('http') && !item.link_url?.includes('localhost');
                return (
                  <li key={i}>
                    {isExternal ? (
                      <a href={item.link_url} target="_blank" rel="noreferrer" className="hover:text-heading transition-colors">
                        {item.title}
                      </a>
                    ) : (
                      <Link to={href} className="hover:text-heading transition-colors" onClick={() => window.scrollTo(0, 0)}>
                        {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-heading font-bold mb-6">{contactsTitle}</h4>
            <div className="text-sm space-y-4">
              {address && (
                <p className="leading-relaxed">
                  <strong>Alamat:</strong>
                  <br />
                  {address}
                </p>
              )}
              {(phone || email) && (
                <p>
                  {phone && <><strong>Telp:</strong> {phone}<br /></>}
                  {email && <><strong>Email:</strong> {email}</>}
                </p>
              )}
              {workingHours && (
                <p>
                  <strong>Jam Operasional:</strong>
                  <br />
                  {workingHours}
                </p>
              )}
            </div>
          </div>
        </div>

        {copyrightText && (
          <div className="pt-8 border-t border-border-light text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-medium text-footer-text">
              {copyrightText}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
