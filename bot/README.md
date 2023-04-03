# BOT #

```
apt-get install pandoc python3 python3-pip python3-dev libxml2-dev libxslt1-dev python3-setuptools imagemagick ghostscript
pip3 install -U wheel TwitterApi Mastodon.py Pillow
```

# IMAGEMAGICK

**/etc/ImageMagick-6/policy.xml**
```
...
<policy domain="coder" rights="read | write" pattern="PDF" />
...
```

# MASTODON-eko kredentzialak lortuteko #
```
from mastodon import Mastodon
Mastodon.create_app('app_name', scopes=['read', 'write'], api_base_url="https://botsin.space")
api = Mastodon("code01", "code02", api_base_url="https://botsin.space")
api.log_in("email", "passwd", scopes=["read", "write"])
```