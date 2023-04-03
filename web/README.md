# NGINX

```
apt-get install nginx-full
```

**/etc/nginx/sites-available/bermiotarra.conf**
```
server {
        server_name     bermiotarra.zital.freemyip.com;
        root            /home/projects/bermiotarra/web/public;

        location /search {
                proxy_cache      dcache;
                proxy_pass       http://bermiotarra-search.pi:8080/search;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        error_log  /var/log/nginx/bermiotarra-error.log error;
        access_log /var/log/nginx/bermiotarra-access.log;
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
apt-get install pandoc texlive-latex-recommended
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