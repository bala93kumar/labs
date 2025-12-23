FROM node:18-alpine

WORKDIR /app

COPY . /app

RUN npm install

ENV PORT=80

EXPOSE  $PORT

CMD ["node", "server.js"]

