# 1. Usar la versión ligera de Node.js
FROM node:22-alpine

# 👉 2. INSTALAR CHROMIUM Y DEPENDENCIAS PARA EL BOT DE WHATSAPP
# Esto le da al contenedor las herramientas para abrir el navegador invisible
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# 👉 3. Variables de entorno para Puppeteer
# Le decimos que NO descargue su propio Chrome pesado, sino que use el de Alpine
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 4. Crear la carpeta donde vivirá tu app
WORKDIR /app

# 5. Copiar dependencias (para optimizar caché)
COPY package*.json ./
COPY prisma ./prisma/

# 6. Instalar las dependencias
RUN npm install

# 7. Generar el cliente de Prisma
RUN npx prisma generate

# 8. Copiar el resto de tu código fuente
COPY . .

# 9. Exponer el puerto
EXPOSE 5000

# 10. Encender la API
CMD ["npm", "start"]