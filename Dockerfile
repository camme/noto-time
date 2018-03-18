FROM node:9.7.0

ENV NODE_PATH=/app/node_modules

RUN mkdir -p /app/node_modules
RUN mkdir -p /app/src

RUN apt-get update && apt-get install -y build-essential vim

COPY package.json /app/src

RUN npm i nodemon -g
RUN npm i sequelize-cli -g
RUN npm --prefix /app/node_modules i 


WORKDIR /app/src

CMD ["nodemon", "dev-test"]
