import sharp from 'sharp';
import { existsSync } from 'fs';
import { join } from 'path';

const assetsDir = './Frontend/public/assets';
const images = [
  { input: 'Hero.png', output: 'Hero.webp' },
  { input: 'Maquillaje2.png', output: 'Maquillaje2.webp' },
  { input: 'Uñas.png', output: 'Unas.webp' },
  { input: 'Manicura.jpeg', output: 'Manicura.webp' },
  { input: 'Maquillaje.jpg', output: 'Maquillaje.webp' },
  { input: 'Peluqueria.jpeg', output: 'Peluqueria.webp' },
  { input: 'peluqueria.jpg', output: 'peluqueria.webp' },
  { input: 'Salon.jpeg', output: 'Salon.webp' }
];

async function optimizeImages() {
  for (const { input, output } of images) {
    const inputPath = join(assetsDir, input);
    const outputPath = join(assetsDir, output);
    
    if (existsSync(inputPath)) {
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`✅ ${input} → ${output}`);
      } catch (err) {
        console.error(`❌ Error con ${input}:`, err.message);
      }
    }
  }
}

optimizeImages();
