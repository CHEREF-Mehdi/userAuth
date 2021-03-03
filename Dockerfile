FROM node:14.15.5

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install