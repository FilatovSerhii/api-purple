FROM node:20-alpine

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Удаляем dev-зависимости
RUN npm prune --production

CMD ["node", "./dist/main.js"]