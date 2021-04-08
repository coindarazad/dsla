#!/bin/bash

truffle exec --network kovan scripts/chores/export-abis.js
truffle exec --network kovan scripts/chores/create-natspec-docs.js
npx prettier --config .prettierrc.abis.json --write 'exported-data/**/**.ts'
npx prettier --write 'natspec-docs/**/**.json'

# copy abis and addresses to frontend, depends on relative roots
rm -rf ../stacktical-dsla-frontend/src/contracts/**
cp -r ./exported-data/* ../stacktical-dsla-frontend/src/contracts