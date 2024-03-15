FROM node:latest

# Set working directory
WORKDIR /app/

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest into the working directory
COPY . .

# Command to run
ENTRYPOINT ["node", "/app/src/exfilms.js"]