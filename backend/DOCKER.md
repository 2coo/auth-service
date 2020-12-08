https://linuxhint.com/docker-container-links/

```bash
docker build -t authserver . 
```
```bash
docker run -it --env-file .env.development.local auth-server
```