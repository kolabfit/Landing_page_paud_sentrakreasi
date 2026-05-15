import { Vibrant } from 'node-vibrant/node';

async function analyzeLogo() {
  try {
    const palette = await Vibrant.from('./public/Logo_1_-removebg-preview.png').getPalette();
    console.log('Vibrant:', palette.Vibrant?.hex);
    console.log('Muted:', palette.Muted?.hex);
    console.log('DarkVibrant:', palette.DarkVibrant?.hex);
    console.log('DarkMuted:', palette.DarkMuted?.hex);
    console.log('LightVibrant:', palette.LightVibrant?.hex);
    console.log('LightMuted:', palette.LightMuted?.hex);
  } catch (error) {
    console.error('Error:', error);
  }
}

analyzeLogo();
