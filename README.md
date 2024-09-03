# Visit Link Admin Frontend

![main workflow](https://github.com/DHEPLab/visit-link-admin-web/actions/workflows/ci.yml/badge.svg)

## Local Development

NodeJS Version v20 LTS

```
$ yarn
$ yarn start
```

By default the app will proxy all the api to localhost:8080, you can change the target by running with `BACKEND_PROXY_TARGET` env variable.
```shell
$ BACKEND_PROXY_TARGET=<url> yarn start
```

## External Dependencies

The visit-link-backend service, with reverse proxy configuration in vite.config.ts

