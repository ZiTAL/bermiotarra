#!/bin/bash
git pull
cd web/private

ncc build ./build.ts -o dist/build
ncc build ./search.ts -o dist/search
ncc build ./server.ts -o dist/server

node dist/build/index.js
cd -
exit 0
