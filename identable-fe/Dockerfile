# Step 1: Use a base Node.js image with a specific version
FROM node:20-alpine as builder

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install the app's dependencies
RUN npm install

# Step 5: Copy the entire Angular app to the container
COPY . .

# Step 6: Set up a build argument to specify the environment (default to production)
ARG configuration=dev

# Step 7: Build the Angular app based on the environment (production/staging)
RUN npm run build:${configuration}

# Step 6: Build the Angular app
#RUN npm run build:dev

# Step 7: Use a lightweight HTTP server to serve the Angular app
FROM nginx:alpine

# Step 8: Copy the built Angular app from the 'builder' container to the nginx container
COPY --from=builder /app/dist/identable-frontend /usr/share/nginx/html

# Step 9: Copy the nginx.conf file to the appropriate location
COPY ./nginx.conf /etc/nginx/nginx.conf
