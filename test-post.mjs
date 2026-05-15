import fs from 'fs';

async function main() {
  const env = fs.readFileSync('.env', 'utf8');
  const keyMatch = env.match(/VITE_CMS_API_KEY\s*=\s*(["']?)([^"'\n\r]+)\1/);
  const key = keyMatch ? keyMatch[2].trim() : '';

  const url = 'https://uni-verse-headless-cms.onrender.com/api/v1/public/posts';
  
  try {
    const res = await fetch(url, { headers: { 'x-api-key': key } });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
main();
