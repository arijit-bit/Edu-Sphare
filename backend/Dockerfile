# Use the official Node.js 22 alpine image for a small, secure base
FROM node:22-alpine

# Set the environment variable to production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port (Cloud Run sets the PORT env var dynamically, but exposing the default helps local testing)
EXPOSE 8080

# Run the application as the non-root 'node' user for security
USER node

# Start the Fastify application
CMD ["npm", "start"]
