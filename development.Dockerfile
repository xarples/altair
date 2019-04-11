FROM node:10

WORKDIR /usr/local/src/

COPY ./package* /usr/local/src/

RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "./wait-for-it.sh", "db:27017", "--", "bash", "./entry.dev.sh" ]
