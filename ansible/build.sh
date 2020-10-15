#!/bin/bash

set -e -u

echo 'Build with yarn'

yarn config set registry https://registry.npm.taobao.org/
yarn global add sonarqube-scanner
yarn
yarn test:ci
yarn build

echo 'Build Done.'
