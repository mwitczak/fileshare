FROM node:10
WORKDIR /app

COPY package.json ./
RUN yarn

COPY . .

EXPOSE 8080
CMD [ "node", "main.js" ]