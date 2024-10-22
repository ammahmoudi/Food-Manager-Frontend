# Use an official Node.js image as a base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Install dependencies first to take advantage of Docker layer caching
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Install development dependencies
RUN npm install --legacy-peer-deps

# Expose the port that Next.js will run on
EXPOSE 3000

# Use the value of NODE_ENV to decide the mode (production or development)
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# If production, run the build and start in production mode
# If development, run the development server
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Start the appropriate command based on the environment
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start; else npm run dev; fi"]
