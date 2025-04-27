FROM node:23.11.0-slim

WORKDIR /wuerflii-frontend

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]