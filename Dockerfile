# Use an official Node.js image as a base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Install dependencies first to take advantage of Docker layer caching
COPY package.json package-lock.json ./
RUN npm i   # Use npm ci for faster, clean install of dependencies

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js application
RUN npm run build
# Install only production dependencies
# RUN npm prune --production

# Expose the port that Next.js will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
