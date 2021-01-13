FROM node:12.19-alpine3.12

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
RUN cp ./src/keys/jwks.json ./dist/keys/
CMD yarn start