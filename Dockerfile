

FROM node:23.11.0-slim AS build

WORKDIR /wuerflii-frontend

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

# NGINX
FROM nginx:alpine
COPY --from=build /wuerflii-frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
