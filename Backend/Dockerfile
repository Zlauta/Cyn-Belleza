FROM node:22-alpine

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

# 1. Metemos TODO tu código adentro del contenedor PRIMERO
COPY . .

# 2. Ahora sí, instalamos. Si Prisma arranca automáticamente, ya encuentra su carpeta.
RUN npm install

# 3. Lo forzamos a generar la conexión a la base de datos
RUN npx prisma generate

EXPOSE 5000

# 4. A la cancha
CMD ["npm", "start"]