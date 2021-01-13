# ON DEVELOPMENT

## 1. Create environment file

You can create environment file (.env) by using example.env template.

```
$ cp example.env .env
```

then open .env and edit variables.

## 2. Install dependencies

```
$ yarn install
```

## 3. Initialize database
***If your database setupped for development:***
```
$ yarn dev:migrate
```

## 4. Seed database with default data

```
$ yarn seed
$ yarn dev:seed
```

## 5. Start server for development

```
$ yarn dev
```

# ON PRODUCTION

## 1. Build code (typescript to javascript)

```
$ yarn build
```

## 2. Start server for production

```
$ yarn start
```

# Using docker on production

```
$ docker-compose up
$ #docker-compose up --force-recreate --build
```

#### Other useful commands

```
$ docker exec -it $container_name sh
$ docker ps -a
$ docker images
$ docker rm -f $container_id_or_name
$ docker rmi -f $container_id_or_name
```