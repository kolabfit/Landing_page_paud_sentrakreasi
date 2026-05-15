import https from 'https';

const options = {
  hostname: 'uni-verse-headless-cms.onrender.com',
  path: '/api/v1/public/pages',
  method: 'GET',
  headers: {
    'x-api-key': 'uni_fe2e643cc16f3ec7e1147a25dabcb099dccb068367b82cb2'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Pages:', data));
});
req.on('error', e => console.error(e));
req.end();
