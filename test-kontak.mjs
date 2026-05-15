const url = 'https://uni-verse-headless-cms.onrender.com/api/v1/public/pages/kontak';
const key = 'uni_fe2e643cc16f3ec7e1147a25dabcb099dccb068367b82cb2';

fetch(url, { headers: { 'x-api-key': key } })
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
