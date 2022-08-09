# PHP / APACHE

```
apache2
apache2-bin
apache2-data
apache2-utils
```

**/etc/apache2/sites-available/bermiotarra.conf**
```
<VirtualHost *:80>
        ServerAdmin zital@github.com
        ServerName bermiotarra.pi
        DocumentRoot "/home/projects/bermiotarra/web/public"

        ProxyPass /bermiotarra/search http://bermiotarra-search.pi:8080/search
        ProxyPassReverse /bermiotarra/search http://bermiotarra-search.pi:8080/search        

        <Directory "/home/projects/bermiotarra/web/public">
                DirectoryIndex index.php

                # apache 2.2
                #Order allow,deny
                #Allow From all

                # apache 2.4
                AllowOverride none
                Require all granted
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/bermiotarra-error.log
        LogLevel error
        CustomLog ${APACHE_LOG_DIR}/bermiotarra-access.log combined
</VirtualHost>
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
cd web/private
npm install @types/node --save
npm install @types/jsdom --save
su
npm i -g @vercel/ncc
exit
```


# PM2 #
```
su
npm install pm2 -g
ln -s /opt/node/bin/pm2         /usr/local/bin/pm2
ln -s /opt/node/bin/pm2-dev     /usr/local/bin/pm2-dev
ln -s /opt/node/bin/pm2-docker  /usr/local/bin/pm2-docker
ln -s /opt/node/bin/pm2-runtime /usr/local/bin/pm2-runtime
exit
```

# UPDATE & DEPLOY #
```
bash update.sh
```