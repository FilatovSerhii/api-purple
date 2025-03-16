FROM node:20-alpine

WORKDIR /opt/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Удаляем dev-зависимости
RUN npm prune --legacy-peer-deps --production

CMD ["node", "./dist/main.js"]