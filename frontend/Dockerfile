FROM node:19-alpine3.15

WORKDIR /frontend
COPY package.json .
COPY package-lock.json .
RUN npm install

CMD ["npm", "start"]