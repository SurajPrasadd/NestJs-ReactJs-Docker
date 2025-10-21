FROM node:25-bullseye

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite in host mode and force polling
CMD ["npm", "run", "dev", "--", "--host", "--force"]
