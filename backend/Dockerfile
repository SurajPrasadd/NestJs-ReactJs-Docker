# backend/Dockerfile
FROM node:25-bullseye

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g @nestjs/cli
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]