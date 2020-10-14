#!/bin/bash

sonar-scanner \
  -Dsonar.projectKey=healthy-future-admin-frontend \
  -Dsonar.sources=. \
  -Dsonar.host.url=${SONAR_HOST_URL} \
  -Dsonar.login=${SONAR_LOGIN}
