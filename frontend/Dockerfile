FROM node:25-bullseye

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm rebuild

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
