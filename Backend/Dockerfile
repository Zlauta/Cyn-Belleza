FROM node:22-alpine

# Le decimos a Puppeteer que no instale nada local porque usamos Browserless
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate
COPY . .

EXPOSE 5000

# Node.js restringido en memoria para no tirar Render
CMD ["node", "--max-old-space-size=250", "src/server.js"]