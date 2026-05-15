import { getPages } from './src/lib/cms';

async function main() {
  const pages = await getPages();
  console.log(JSON.stringify(pages, null, 2));
}
main();
