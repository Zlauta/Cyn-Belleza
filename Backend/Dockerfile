FROM node:22-alpine

# Instalamos el Chromium liviano de Alpine y sus dependencias gráficas
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Obligamos a Puppeteer a usar este navegador enano y no descargar el pesado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 5000

# 👉 EL TRUCO FINAL: Le ponemos un candado a Node para que no use más de 250MB de RAM
# y le deje la otra mitad de los 512MB al navegador.
CMD ["node", "--max-old-space-size=250", "src/server.js"]