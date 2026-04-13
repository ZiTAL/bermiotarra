FROM node:24.1.0-alpine3.21

RUN apk add imagemagick ghostscript texlive texmf-dist-latexextra texmf-dist-fontsrecommended texmf-dist-latexrecommended texmf-dist-latex texmf-dist pandoc
RUN npm i -g @vercel/ncc
WORKDIR /app/web/private

#RUN cd /app/web/private && \
#    ncc build ./build.ts -o dist/build && \
#    ncc build ./search.ts -o dist/search && \
#    ncc build ./server.ts -o dist/server

CMD ["node", "dist/server/index.js"]
