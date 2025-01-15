FROM node:18-bullseye

WORKDIR /app

COPY package*.json vite.config.js /app/

RUN npm prune --production

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
