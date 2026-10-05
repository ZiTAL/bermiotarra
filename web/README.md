# CADDY

```
apt-get install caddy
```

**/etc/caddy/Caddyfile**
```
bermiotarra.zital.eus, bermiotarra.opi5 {
        root * /home/projects/bermiotarra/web/public
        route {
                handle /search* {
                        reverse_proxy bermiotarra-search.pi:8080
                }
                handle {
                        file_server
                }
        }

        log {
                output file /var/log/caddy/bermiotarra-access.log
        }
}
```

**/etc/hosts**
```
127.0.0.1   bermiotarra.pi
127.0.0.1   bermiotarra-search.pi

```


# HTML eta PDF-ra bihurtuteko #
```
su
apt-get install pandoc texlive-latex-recommended calibre
pip install --no-binary lxml lxml --break-system-packages
exit
```

# NODE
```
su
chown -R pi:pi /opt
exit
cd /opt
wget https://nodejs.org/dist/v18.15.0/node-v18.15.0-linux-arm64.tar.xz
tar -xf node-v18.15.0-linux-arm64.tar.xz
ln -s /opt/node-v18.15.0-linux-arm64 /opt/node
su
ln -s /opt/node/bin/corepack /usr/local/bin/corepack
ln -s /opt/node/bin/node /usr/local/bin/node
ln -s /opt/node/bin/npm /usr/local/bin/npm
ln -s /opt/node/bin/npx /usr/local/bin/npx
chmod -R +x /usr/local/bin/
exit
```

# TYPESCRIPT #
```
npm i -g @vercel/ncc
su
ln -s /opt/node/bin/ncc /usr/local/bin/ncc
chmod -R +x /usr/local/bin/
exit

cd web/private
npm install
```

# PM2 #
```
su
npm install pm2 -g
ln -s /opt/node/bin/pm2         /usr/local/bin/pm2
ln -s /opt/node/bin/pm2-dev     /usr/local/bin/pm2-dev
ln -s /opt/node/bin/pm2-docker  /usr/local/bin/pm2-docker
ln -s /opt/node/bin/pm2-runtime /usr/local/bin/pm2-runtime
chmod -R +x /usr/local/bin/
exit
pm2 startup
sudo env PATH=$PATH:/opt/node/bin /opt/node/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
pm2 start
```

# UPDATE & DEPLOY #
```
bash deploy.sh

# DOCKER / PODMAN #

https://github.com/ZiTAL/containers/tree/main/bermiotarra

## ARAZOAK KONPONTZEN (2026-07-16) ##

Stack-a ez zegoen abiatzen. Sintomak:

- `bermiotarra_python_1` egoeran `Created` geratzen zen.
- `bermiotarra_deno_1` eta `bermiotarra_nginx_1` `Exited` (7 aste).
- Errorea: `did not receive systemd slice as cgroup parent when using systemd to manage cgroups: invalid argument`.

Rootless podman-ek ez du systemd cgroup-ekin funtzionatzen `userns = "host"` konfiguratuta dagoenean.

**Konponketa:** `~.config/containers/containers.conf`-n cgroup_manager zehaztu:

```
[containers]
userns = "host"
cgroup_manager = "cgroupfs"
```

**Garbitu eta berriro altxatu:**

```
cd /home/projects/bermiotarra/docker
podman rm -f bermiotarra_python_1 bermiotarra_deno_1 bermiotarra_nginx_1 \
              docker_python_1 docker_deno_1 docker_caddy_1
podman pod rm -f <pod_bermiotarra> <bermiotarra_new> <pod_docker>
podman-compose up -d --no-cache
```

**Egiaztapenak:**

- `podman ps -a --filter name='docker_'` → denak `Up`.
- `curl -I http://localhost:8002` → `HTTP/1.1 200 OK`.
- `curl -I http://bermiotarra.opi5 -H 'Host: bermiotarra.opi5'` → `HTTP/1.1 200 OK`.
- `curl 'http://bermiotarra.opi5/search?q=kaixo'` → HTML orria itzultzen du.

**Oharrak:**

- `podman-compose`-k `docker-compose.yml`-ko `services` blokean oinarrituta aurrizki gisa direktorio-izena (`docker`) erabiltzen du, eta `_1` gehitzen. `name: bermiotarra` gehituz gero, `bermiotarra_python_1`, `bermiotarra_deno_1`, `bermiotarra_caddy_1` izango lirateke.
- `web-static` eta `ollama` pod-ak ez dira ukitu.

# HTML SORTU #
```
deno --allow-run build.ts
```

# PDF EPUB 
```
cd /web/private
python build.py
```
