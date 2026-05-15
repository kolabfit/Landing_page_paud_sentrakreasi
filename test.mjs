import fs from 'fs';

async function main() {
  const env = fs.readFileSync('.env', 'utf8');
  const keyMatch = env.match(/VITE_CMS_API_KEY\s*=\s*(["']?)([^"'\n\r]+)\1/);
  const key = keyMatch ? keyMatch[2].trim() : '';
  
  if (!key) {
    console.error("No API key found in .env");
    return;
  }

  const url = 'https://uni-verse-headless-cms.onrender.com/api/v1/public/pages';
  
  try {
    const res = await fetch(url, { headers: { 'x-api-key': key } });
    const data = await res.json();
    
    // The data might be an array directly
    const pages = Array.isArray(data) ? data : data.data;
    
    if (pages) {
      const galeri = pages.find(p => p.slug === 'galeri');
      console.log(JSON.stringify(galeri, null, 2));
    } else {
      console.log("No data array in response:", data);
    }
  } catch (err) {
    console.error(err);
  }
}

main();
