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

# HTML SORTU #
```
deno --allow-run build.ts
```

# PDF EPUB 
```
cd /web/private
python build.py
```
