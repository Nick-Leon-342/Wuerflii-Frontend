FROM node:18.17.0

WORKDIR /kniffel

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 10000

CMD [ "npm", "start" ]