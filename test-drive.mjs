import fs from 'fs';

async function main() {
  const url = 'https://drive.google.com/thumbnail?id=1fVkE2G6InxH18zleD5riNsSUgbdegxYg&sz=w1200';
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get('content-type'));
    const text = await res.text();
    console.log("Body length:", text.length);
    console.log("Body preview:", text.substring(0, 100));
  } catch (err) {
    console.error(err);
  }
}
main();
