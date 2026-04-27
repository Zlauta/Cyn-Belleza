#!/bin/bash
# Script para optimizar imágenes a WebP
# Requiere: ImageMagick o sharp CLI instalados

# Si no tienes sharp instalado, instálalo primero:
# npm install --save-dev sharp

# Usando Node.js con sharp:
cat > optimize-images.js << 'EOF'
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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
    const inputPath = path.join(assetsDir, input);
    const outputPath = path.join(assetsDir, output);
    
    if (fs.existsSync(inputPath)) {
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
EOF

node optimize-images.js
