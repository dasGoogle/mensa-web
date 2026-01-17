# Stage 1: Build the Flutter web application
FROM node:25 AS builder

WORKDIR /app
COPY package*.json /app
RUN npm ci

COPY . /app


RUN npm run build

# Stage 2: Create the Nginx container
FROM docker.io/nginx:latest

# Copy the built Flutter web application to the Nginx container
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
