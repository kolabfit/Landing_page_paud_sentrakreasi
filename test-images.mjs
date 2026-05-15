import fs from 'fs';

async function main() {
  const env = fs.readFileSync('.env', 'utf8');
  const keyMatch = env.match(/VITE_CMS_API_KEY\s*=\s*(["']?)([^"'\n\r]+)\1/);
  const key = keyMatch ? keyMatch[2].trim() : '';

  const url = 'https://uni-verse-headless-cms.onrender.com/api/v1/public/pages';
  
  try {
    const res = await fetch(url, { headers: { 'x-api-key': key } });
    const data = await res.json();
    const pages = Array.isArray(data) ? data : data.data;
    
    // Let's just find the first few image URLs and try to fetch them
    const urls = [];
    pages.forEach(p => {
      p.content?.forEach(b => {
        const d = b.data || {};
        if (d.background_image) urls.push(d.background_image);
        if (d.background_image_url) urls.push(d.background_image_url);
        if (d.images) d.images.forEach(i => urls.push(i.url || i.image || i.src));
        if (d.members) d.members.forEach(m => urls.push(m.photo_url || m.photo));
        if (d.items) d.items.forEach(i => urls.push(i.icon || i.image));
      });
    });
    
    const uniqueUrls = [...new Set(urls.filter(u => typeof u === 'string' && u.startsWith('http')))].slice(0, 5);
    console.log("Found URLs:", uniqueUrls);
    
    for (const u of uniqueUrls) {
      try {
        const imgRes = await fetch(u, { method: 'HEAD' });
        console.log(`URL: ${u} - Status: ${imgRes.status}`);
      } catch (e) {
        console.log(`URL: ${u} - Error: ${e.message}`);
      }
    }
    
  } catch (err) {
    console.error(err);
  }
}
main();
