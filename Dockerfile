FROM node:12.19-alpine3.12

WORKDIR /app
COPY . /app
COPY package.json /app
RUN yarn install
RUN yarn build
EXPOSE 80
CMD [ "yarn", "start" ]