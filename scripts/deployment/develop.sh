#!/bin/bash
export NODE_ENV=develop

npx prettier --write 'contracts/**/*.sol'

truffle deploy --reset --network develop

truffle exec --network develop scripts/bootstrap/develop.js
truffle exec --network develop scripts/chores/mint-tokens.js
truffle exec --network develop scripts/chores/deploy-sla.js
truffle exec --network develop scripts/chores/request-sli.js

./scripts/chores/export-data.sh