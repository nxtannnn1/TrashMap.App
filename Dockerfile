# Build stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve com Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copia configuração customizada do Nginx, se houver
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
