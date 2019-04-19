FROM node:10

WORKDIR /usr/local/src/

COPY ./package* /usr/local/src/

RUN npm install

COPY . .

EXPOSE 3000

RUN chmod +x /usr/local/src/wait-for-it.sh

CMD ["./wait-for-it.sh", "db:27017", "--", "npm", "run", "start-dev"]