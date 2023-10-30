 FROM node:latest

 WORKDIR /app

 COPY package.json /app

 RUN npm install

 COPY . .

 CMD [ "npm", "run", "dev" ]
