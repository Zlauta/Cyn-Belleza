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

# 1. Copiamos solo los package para instalar dependencias
COPY package*.json ./
RUN npm install

# 2. Copiamos TODO tu código de una (incluida la carpeta prisma esté donde esté)
COPY . .

# 3. Ahora que ya tiene todo el código, generamos Prisma
RUN npx prisma generate

EXPOSE 5000

# 4. Arrancamos
CMD ["npm", "start"]