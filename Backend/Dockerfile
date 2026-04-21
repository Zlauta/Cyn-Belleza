FROM node:22-alpine

# 👉 1. Instalamos el Chromium livianito para que RemoteAuth pueda hacer su .zip
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate
COPY . .

EXPOSE 5000

# 👉 2. EL SALVAVIDAS DE RENDER: Node solo usa 250MB, el resto se lo deja a Chromium
CMD ["node", "--max-old-space-size=250", "src/server.js"]