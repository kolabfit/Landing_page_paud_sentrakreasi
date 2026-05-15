const fs = require('fs');

async function main() {
  const env = fs.readFileSync('.env', 'utf8');
  const keyMatch = env.match(/VITE_CMS_API_KEY=([^\n\r]+)/);
  const key = keyMatch ? keyMatch[1] : '';
  
  if (!key) {
    console.error("No API key found in .env");
    return;
  }

  const url = 'https://uni-verse-headless-cms.onrender.com/api/v1/public/pages';
  
  try {
    const res = await fetch(url, { headers: { 'x-api-key': key } });
    const data = await res.json();
    
    if (data && data.data) {
      // Just print titles, slugs, and blocks
      const summary = data.data.map(p => ({
        title: p.title,
        slug: p.slug,
        blocks: p.content?.map(b => ({
          type: b.type,
          dataKeys: b.data ? Object.keys(b.data) : []
        }))
      }));
      console.log(JSON.stringify(summary, null, 2));
    } else {
      console.log("No data array in response:", data);
    }
  } catch (err) {
    console.error(err);
  }
}

main();
