# 1. Usar la versión ligera de Node.js
FROM node:22-alpine

# 👉 2. EL TRUCO PARA AHORRAR TIEMPO Y ESPACIO
# Le decimos a npm que cuando instale 'puppeteer', NO intente descargar 
# el Chrome de 150MB que trae por defecto, porque total usamos Browserless.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 3. Crear la carpeta donde vivirá tu app
WORKDIR /app

# 4. Copiar los archivos de dependencias (para optimizar caché)
COPY package*.json ./
COPY prisma ./prisma/

# 5. Instalar las dependencias de Node
RUN npm install

# 6. Generar el cliente de Prisma para la base de datos
RUN npx prisma generate

# 7. Copiar el resto de tu código fuente
COPY . .

# 8. Exponer el puerto
EXPOSE 5000

# 9. Encender la API
CMD ["npm", "start"]