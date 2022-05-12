# BOT #

```
pandoc
python3
python3-pip
python3-dev
libxml2-dev
libxslt1-dev
python3-setuptools
imagemagick

pip3 install wheel
pip3 install TwitterApi
pip3 install Mastodon.py
pip3 install Pillow
```

# MASTODON-eko kredentzialak lortuteko #
```
from mastodon import Mastodon
Mastodon.create_app('app_name', scopes=['read', 'write'], api_base_url="https://botsin.space")
api = Mastodon("code01", "code02", api_base_url="https://botsin.space")
api.log_in("email", "passwd", scopes=["read", "write"])
```