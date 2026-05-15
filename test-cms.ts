import { getPages, getSettings } from './src/lib/cms';

async function main() {
  try {
    const pages = await getPages();
    const kontak = pages.find(p => p.slug.includes('kontak') || p.title.toLowerCase().includes('kontak'));
    console.log('Found page:', kontak);
    if (kontak) {
      const { getPageBySlug } = await import('./src/lib/cms');
      const detail = await getPageBySlug(kontak.slug);
      console.log('Detail:', JSON.stringify(detail, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
main();
