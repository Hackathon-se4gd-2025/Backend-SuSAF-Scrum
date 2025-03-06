# Use Node.js 22 as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application (if needed)
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Set environment variables for MongoDB connection
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "run", "start:prod"]