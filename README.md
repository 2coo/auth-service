# Configure
Please, create .env.development from example.env by coping and configure database and port
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f ./keys/default.key
```
1. First install packages
```
$ yarn install
```

`After that it will generate Prisma client automatically.`

`Don't install prisma/client & prisma/cli because you already have prisma cli from nexus-prisma-plugin.`

Datamodel - Prisma schema

![Workflow](https://i.ibb.co/S02741J/prisma-migrate.png)


If you have faced problem with migration, [click here](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-migrate) to read more.


Command:

```
$ npx prisma
```

```
$ npx prisma migrate
```


# Run install

```
$ yarn run dev
```


