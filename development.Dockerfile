FROM node:10

WORKDIR /usr/local/src/

COPY ./package* /usr/local/src/

RUN npm install

COPY . .

EXPOSE 3000

CMD ["bash", "./wait-for-it.sh", "db:5432", "--", "bash", "./entry.dev.sh" ]
