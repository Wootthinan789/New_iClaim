# Use an official Node.js LTS (Long Term Support) image as the base image
FROM node:lts as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the React app
RUN npm run build

# Use the lightweight Nginx image for the production stage
FROM nginx:stable-alpine as production-stage

# Copy the build artifacts from the build stage to the production stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# The following steps are optional and depend on your specific configuration
# For example, if you need a custom Nginx configuration, you can include it here:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
