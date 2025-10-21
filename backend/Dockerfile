FROM node:25-bullseye

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
RUN npm install --save-dev ts-node-dev

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
