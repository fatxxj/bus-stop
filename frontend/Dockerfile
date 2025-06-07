# Stage 1: Build the Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose port 4200 for the Angular application
EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0"]
