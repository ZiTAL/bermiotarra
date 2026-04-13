FROM python:3.12.10-alpine3.22

RUN apk add --no-cache imagemagick ghostscript pandoc \
    texlive texmf-dist-latexextra texmf-dist-fontsrecommended \
    texmf-dist-latexrecommended texmf-dist-latex texmf-dist

RUN pip3 install -U wheel Mastodon.py Pillow

CMD ["tail", "-f", "/dev/null"]
