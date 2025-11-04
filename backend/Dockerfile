FROM node:25-bullseye

WORKDIR /usr/src/app

# Install editors (optional but useful for debugging)
RUN apt-get update && apt-get install -y vim nano && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5000
CMD ["npm", "run", "start:dev"]