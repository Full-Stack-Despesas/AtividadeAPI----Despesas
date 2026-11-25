FROM node:24-slim

WORKDIR /app

# Instala as dependências primeiro para aproveitar o cache de camadas
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000

# Roda migrations + seeders e depois sobe a API
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "app.js"]
