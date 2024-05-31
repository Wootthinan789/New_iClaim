# Step 1: Build the React app
FROM node:16 as build

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install --force

COPY . /app

RUN npm run build

# Step 2: Serve the React app with Nginx
FROM nginx:1.18

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
