# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy the build files to the Nginx HTML directory
COPY build /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
