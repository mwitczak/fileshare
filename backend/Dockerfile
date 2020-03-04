FROM node:10
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 8080
CMD yarn db:migrate && yarn start