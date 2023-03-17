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
                proxy_pass       http://bermiotarra-search.opi4:8080/search;
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
pandoc
texlive-base
texlive-binaries
texlive-extra-utils
texlive-font-utils
texlive-fonts-recommended
texlive-fonts-recommended-doc
texlive-fonts-recommended
texlive-generic-extra
texlive-generic-recommended
texlive-latex-base
texlive-latex-base-doc
texlive-latex-extra
texlive-latex-extra-doc
texlive-latex-recommended
texlive-latex-recommended-doc
texlive-pictures
texlive-pictures-doc
texlive-pstricks
texlive-pstricks-doc
texlive-xetex
```

# TYPESCRIPT #
```
su
npm i -g @vercel/ncc
exit
cd web/private
npm install
```

# PM2 #
```
su
npm install pm2 -g
# ln -s /opt/node/bin/pm2         /usr/local/bin/pm2
# ln -s /opt/node/bin/pm2-dev     /usr/local/bin/pm2-dev
# ln -s /opt/node/bin/pm2-docker  /usr/local/bin/pm2-docker
# ln -s /opt/node/bin/pm2-runtime /usr/local/bin/pm2-runtime
exit
pm2 startup
sudo env PATH=$PATH:/opt/node-v18.12.1/bin /opt/node-v18.12.1/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
pm2 start
```

# UPDATE & DEPLOY #
```
bash deploy.sh