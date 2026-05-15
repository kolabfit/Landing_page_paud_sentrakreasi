import https from 'https';

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'uni-verse-headless-cms.onrender.com',
      path,
      method: 'GET',
      headers: { 'x-api-key': 'uni_fe2e643cc16f3ec7e1147a25dabcb099dccb068367b82cb2' }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve(data); } });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const pages = await fetchUrl('/api/v1/public/pages');
  const footer = pages.find(p => p.slug === 'footer' || p.title === 'Footer');
  if (footer) {
    console.log('=== FOOTER CMS CONTENT (CURRENT) ===');
    console.log(JSON.stringify(footer.content, null, 2));
  }
}
main();
