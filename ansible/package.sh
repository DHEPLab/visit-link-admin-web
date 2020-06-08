#!/bin/bash

set -e -u

root_dir="$(cd $(dirname $0)/../ && pwd)"

BACKEND_SERVICE=${BACKEND_SERVICE:-0.0.0.0} \
# envsubst < "${root_dir}/etc/nginx/conf.d/service.conf.template" > "${root_dir}/etc/nginx/conf.d/service.conf"

echo 'Package files into zip file'
cd "${root_dir}"
tar --exclude "etc/nginx/conf.d/service.conf.template" -cvzf app.tar.gz "build" "etc" "docker-compose.yml" "startDocker.sh"

echo 'Package done.'
