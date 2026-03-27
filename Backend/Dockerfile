# 1. Usar una versión ligera de Node.js como base
FROM node:22-alpine

# 2. Crear la carpeta donde vivirá tu app adentro del contenedor
WORKDIR /app

# 3. Copiar los archivos de configuración primero (para optimizar caché)
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instalar las dependencias
RUN npm install

# 5. Generar el cliente de Prisma para que la base de datos funcione
RUN npx prisma generate

# 6. Copiar el resto de tu código fuente (controladores, rutas, etc.)
COPY . .

# 7. Exponer el puerto en el que escucha tu servidor
EXPOSE 3000

# 8. El comando exacto para encender la API
CMD ["npm", "start"]