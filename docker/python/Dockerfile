FROM python:3.12.10-alpine3.22

RUN apk add --no-cache font-dejavu imagemagick ghostscript pandoc py3-weasyprint

RUN pip3 install -U wheel Mastodon.py Pillow

CMD ["tail", "-f", "/dev/null"]
