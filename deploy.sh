#!/bin/bash
git pull
cd web/private

if [ "$1" == "build" ]; then
    ncc build ./build.ts    -o dist/build
    ncc build ./search.ts   -o dist/search
    ncc build ./server.ts   -o dist/server
fi

node dist/build/index.js

pm2 stop bermiotarra
pm2 start dist/server/index.js --name bermiotarra
pm2 save

cd -
exit 0
