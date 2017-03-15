npm run build
npm run test-ci
node ./node_modules/remap-istanbul/bin/remap-istanbul -i ./coverage/coverage.json -o ./coverage/lcov.info --exclude node_modules --type lcovonly