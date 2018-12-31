# PHP / APACHE

apache2
apache2-bin
apache2-data
apache2-utils
libapache2-mod-php
libapache2-mod-php7.0
php-common
php-mbstring
php-xml
php7.0-cli
php7.0-common
php7.0-json
php7.0-mbstring
php7.0-opcache
php7.0-readline
php7.0-xml


**/etc/apache2/sites-available/bermiotarra.conf**
```
<VirtualHost *:80>
        ServerAdmin zital@github.com
        ServerName bermiotarra.pi2
        DocumentRoot "/home/projects/bermiotarra/web/public"

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
```

# HTML eta PDF-ra bihurtuteko #

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

# SORTU #

dana:
```
php web/private/build.php
```

html bakarrik:
```
php web/private/html.php
```

pdf bakarrik:
```
php web/private/pdf.php
```